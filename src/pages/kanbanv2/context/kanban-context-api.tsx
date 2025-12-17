import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { KanbanColumnData, Task, Priority } from '../types';
import {
    getKanbanBoardFull,
    createKanbanBoard,
    createColumn as apiCreateColumn,
    updateColumn as apiUpdateColumn,
    deleteColumn as apiDeleteColumn,
    reorderColumn as apiReorderColumn,
    createTask as apiCreateTask,
    updateTask as apiUpdateTask,
    deleteTask as apiDeleteTask,
    moveTask as apiMoveTask,
    transformKanbanBoardToFrontend,
} from '../api/kanban-api-service';

export interface KanbanContextType {
    columns: KanbanColumnData[];
    boardId: string | null;
    itemId: string | null;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    moveCard: (cardId: string, sourceColumnId: string, targetColumnId: string, targetIndex: number) => void;
    moveColumn: (columnId: string, newIndex: number) => void;
    createTask: (columnId: string, title: string, description?: string, priority?: Priority, position?: 'top' | 'bottom') => void;
    createColumn: (title: string, position?: number, color?: string) => void;
    updateColumn: (columnId: string, title: string, color?: string) => void;
    deleteColumn: (columnId: string) => void;
    toggleSubtask: (columnId: string, cardId: string, subtaskId: string, done?: boolean) => void;
    addSubtask: (columnId: string, cardId: string, title: string, parentSubtaskId?: string) => void;
    removeSubtask: (columnId: string, cardId: string, subtaskId: string) => void;
    updateTask: (taskId: string, updates: Partial<Task>) => void;
    refetch: () => Promise<void>;
}

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useKanban = () => {
    const context = useContext(KanbanContext);
    if (!context) {
        throw new Error('useKanban must be used within KanbanProvider');
    }
    return context;
};

interface KanbanProviderProps {
    children: ReactNode;
    itemId: string | null;
}

/**
 * Helper to find task by ID recursively in columns
 */
function findTaskInColumns(columns: KanbanColumnData[], taskId: string): { task: Task; columnId: string } | null {
    for (const column of columns) {
        const findInTasks = (tasks: Task[]): Task | null => {
            for (const task of tasks) {
                if (task.id === taskId) return task;
                if (task.subtasks) {
                    const found = findInTasks(task.subtasks);
                    if (found) return found;
                }
            }
            return null;
        };

        const task = findInTasks(column.cards);
        if (task) return { task, columnId: column.id };
    }
    return null;
}

export const KanbanProvider = ({ children, itemId }: KanbanProviderProps) => {
    const [columns, setColumns] = useState<KanbanColumnData[]>([]);
    const [boardId, setBoardId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Store previous state for rollback
    const previousStateRef = useRef<KanbanColumnData[]>([]);
    const pendingOperationsRef = useRef<Set<string>>(new Set());
    // Ref to always access current columns state
    const columnsRef = useRef<KanbanColumnData[]>([]);

    // Keep ref in sync with state
    useEffect(() => {
        columnsRef.current = columns;
    }, [columns]);

    /**
     * Fetch kanban board data
     */
    const fetchBoard = useCallback(async () => {
        if (!itemId) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setIsError(false);
            setError(null);

            // Try to fetch existing board
            try {
                const boardData = await getKanbanBoardFull(itemId);
                setBoardId(boardData.id);
                const transformedData = transformKanbanBoardToFrontend(boardData);
                setColumns(transformedData);
                previousStateRef.current = JSON.parse(JSON.stringify(transformedData)); // Deep clone
            } catch (err: any) {
                // If board doesn't exist (404), create it
                // Axios errors have response.status, other errors might have different structure
                const isNotFound =
                    err?.response?.status === 404 ||
                    err?.status === 404 ||
                    err?.message?.toLowerCase().includes('not found') ||
                    err?.message?.toLowerCase().includes('404');

                if (isNotFound) {
                    try {
                        const newBoard = await createKanbanBoard(itemId);
                        setBoardId(newBoard.id);
                        setColumns([]);
                        previousStateRef.current = [];
                    } catch (createErr) {
                        // If creation also fails, throw the original error
                        throw err;
                    }
                } else {
                    throw err;
                }
            }
        } catch (err) {
            setIsError(true);
            setError(err instanceof Error ? err : new Error('Failed to fetch kanban board'));
            console.error('Failed to fetch kanban board:', err);
        } finally {
            setIsLoading(false);
        }
    }, [itemId]);

    /**
     * Get boardId (from state or fetch if needed)
     */
    const getBoardIdFromBackend = useCallback(async (): Promise<string> => {
        if (boardId) return boardId;

        if (!itemId) throw new Error('ItemId is required');

        try {
            const boardData = await getKanbanBoardFull(itemId);
            setBoardId(boardData.id);
            return boardData.id;
        } catch (err) {
            console.error('Failed to get boardId:', err);
            throw err;
        }
    }, [itemId, boardId]);

    // Fetch board on mount and when itemId changes
    useEffect(() => {
        fetchBoard();
    }, [fetchBoard]);

    /**
     * Rollback to previous state
     */
    const rollback = useCallback(() => {
        setColumns(JSON.parse(JSON.stringify(previousStateRef.current)));
    }, []);

    /**
     * Save current state for rollback
     */
    const saveState = useCallback(() => {
        previousStateRef.current = JSON.parse(JSON.stringify(columnsRef.current));
    }, []);

    /**
     * Optimistic update wrapper
     */
    const optimisticUpdate = useCallback(
        async <T,>(
            operationId: string,
            optimisticUpdateFn: () => void,
            apiCall: () => Promise<T>,
            onSuccess?: (result: T) => void,
            onError?: (error: Error) => void
        ) => {
            // Skip if operation is already pending
            if (pendingOperationsRef.current.has(operationId)) {
                return;
            }

            pendingOperationsRef.current.add(operationId);
            saveState();
            optimisticUpdateFn();

            try {
                const result = await apiCall();
                onSuccess?.(result);
            } catch (err) {
                console.error(`Operation ${operationId} failed:`, err);
                rollback();
                onError?.(err instanceof Error ? err : new Error('Operation failed'));
            } finally {
                pendingOperationsRef.current.delete(operationId);
            }
        },
        [saveState, rollback]
    );

    const moveCard = useCallback((
        cardId: string,
        sourceColumnId: string,
        targetColumnId: string,
        targetIndex: number
    ) => {
        optimisticUpdate(
            `move-card-${cardId}`,
            () => {
                setColumns((prevColumns) => {
                    const newColumns = [...prevColumns];
                    const sourceColumnIndex = newColumns.findIndex((col) => col.id === sourceColumnId);
                    const targetColumnIndex = newColumns.findIndex((col) => col.id === targetColumnId);

                    if (sourceColumnIndex === -1 || targetColumnIndex === -1) return prevColumns;

                    const cardIndex = newColumns[sourceColumnIndex].cards.findIndex((card) => card.id === cardId);
                    if (cardIndex === -1) return prevColumns;

                    const [movedCard] = newColumns[sourceColumnIndex].cards.splice(cardIndex, 1);

                    let adjustedTargetIndex = targetIndex;
                    if (sourceColumnIndex === targetColumnIndex && targetIndex > cardIndex) {
                        adjustedTargetIndex = targetIndex - 1;
                    }

                    const clampedTargetIndex = Math.max(
                        0,
                        Math.min(adjustedTargetIndex, newColumns[targetColumnIndex].cards.length)
                    );

                    newColumns[targetColumnIndex].cards.splice(clampedTargetIndex, 0, movedCard);
                    return newColumns;
                });
            },
            async () => {
                return await apiMoveTask(cardId, targetColumnId, targetIndex);
            }
        );
    }, [optimisticUpdate]);

    const moveColumn = useCallback((columnId: string, newIndex: number) => {
        optimisticUpdate(
            `move-column-${columnId}`,
            () => {
                setColumns((prevColumns) => {
                    const columnIndex = prevColumns.findIndex((col) => col.id === columnId);
                    if (columnIndex === -1 || newIndex < 0 || newIndex >= prevColumns.length) return prevColumns;

                    const newColumns = [...prevColumns];
                    const [movedColumn] = newColumns.splice(columnIndex, 1);
                    newColumns.splice(newIndex, 0, movedColumn);
                    return newColumns;
                });
            },
            async () => {
                return await apiReorderColumn(columnId, newIndex);
            }
        );
    }, [optimisticUpdate]);

    const createTask = useCallback((
        columnId: string,
        title: string,
        description?: string,
        priority?: Priority,
        position: 'top' | 'bottom' = 'bottom'
    ) => {
        const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        optimisticUpdate(
            `create-task-${tempId}`,
            () => {
                setColumns((prevColumns) => {
                    const columnIndex = prevColumns.findIndex((col) => col.id === columnId);
                    if (columnIndex === -1) return prevColumns;

                    // Check if task with same temp ID already exists (prevent duplicates)
                    const existingTask = prevColumns[columnIndex].cards.find((t) => t.id === tempId);
                    if (existingTask) return prevColumns;

                    const newTask: Task = {
                        id: tempId,
                        title,
                        description: description || "",
                        priority: priority || 'medium',
                        tags: [],
                        done: false,
                        isParent: false,
                        parentId: null,
                        subtasks: [],
                    };

                    const newColumns = [...prevColumns];
                    if (position === 'top') {
                        newColumns[columnIndex].cards.unshift(newTask);
                    } else {
                        newColumns[columnIndex].cards.push(newTask);
                    }

                    return newColumns;
                });
            },
            async () => {
                // Use columnsRef to get latest state instead of stale closure
                const currentColumns = columnsRef.current;
                const column = currentColumns.find((col) => col.id === columnId);
                if (!column) throw new Error('Column not found');

                const result = await apiCreateTask(columnId, title, {
                    description,
                    priority,
                    done: false,
                });

                // Update temp ID with real ID atomically
                setColumns((prevColumns) => {
                    const newColumns = [...prevColumns];
                    const colIndex = newColumns.findIndex((col) => col.id === columnId);
                    if (colIndex !== -1) {
                        const taskIndex = newColumns[colIndex].cards.findIndex((t) => t.id === tempId);
                        if (taskIndex !== -1) {
                            // Replace temp task with real task from backend
                            newColumns[colIndex].cards[taskIndex] = {
                                ...newColumns[colIndex].cards[taskIndex],
                                id: result.id,
                            };
                        }
                    }
                    return newColumns;
                });

                return result;
            }
        );
    }, [optimisticUpdate, getBoardIdFromBackend]);

    const createColumn = useCallback(async (title: string, position?: number, color?: string) => {
        if (!itemId) return;

        const tempId = `temp-col-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        optimisticUpdate(
            `create-column-${tempId}`,
            () => {
                setColumns((prevColumns) => {
                    const newColumn: KanbanColumnData = {
                        id: tempId,
                        title,
                        color,
                        cards: []
                    };

                    const newColumns = [...prevColumns];
                    if (position !== undefined && position >= 0 && position <= newColumns.length) {
                        newColumns.splice(position, 0, newColumn);
                    } else {
                        newColumns.push(newColumn);
                    }

                    return newColumns;
                });
            },
            async () => {
                const boardId = await getBoardIdFromBackend();
                const result = await apiCreateColumn(boardId, title, color);

                // Update temp ID with real ID
                setColumns((prevColumns) => {
                    const newColumns = [...prevColumns];
                    const colIndex = newColumns.findIndex((col) => col.id === tempId);
                    if (colIndex !== -1) {
                        newColumns[colIndex] = {
                            ...newColumns[colIndex],
                            id: result.id,
                        };
                    }
                    return newColumns;
                });

                return result;
            }
        );
    }, [optimisticUpdate, itemId, getBoardIdFromBackend]);

    const updateColumn = useCallback((columnId: string, title: string, color?: string) => {
        optimisticUpdate(
            `update-column-${columnId}`,
            () => {
                setColumns((prevColumns) => {
                    const columnIndex = prevColumns.findIndex(col => col.id === columnId);
                    if (columnIndex === -1) return prevColumns;

                    const newColumns = [...prevColumns];
                    newColumns[columnIndex] = { ...newColumns[columnIndex], title, color };
                    return newColumns;
                });
            },
            async () => {
                return await apiUpdateColumn(columnId, { title, color: color || null });
            }
        );
    }, [optimisticUpdate]);

    const deleteColumn = useCallback((columnId: string) => {
        optimisticUpdate(
            `delete-column-${columnId}`,
            () => {
                setColumns((prevColumns) => prevColumns.filter(col => col.id !== columnId));
            },
            async () => {
                await apiDeleteColumn(columnId);
            }
        );
    }, [optimisticUpdate]);

    const toggleSubtask = useCallback((
        columnId: string,
        cardId: string,
        subtaskId: string,
        done?: boolean
    ) => {
        // Skip API call for temp IDs (tasks that haven't been created on backend yet)
        if (subtaskId.startsWith('temp-')) {
            // Just update locally
            setColumns((prevColumns) => {
                return prevColumns.map((column) => {
                    if (column.id !== columnId) return column;

                    return {
                        ...column,
                        cards: column.cards.map((card) => {
                            if (card.id !== cardId) return card;

                            const updateSubtask = (subtasks: Task[]): Task[] => {
                                return subtasks.map((subtask) => {
                                    if (subtask.id === subtaskId) {
                                        return { ...subtask, done: done !== undefined ? done : !subtask.done };
                                    }
                                    if (subtask.subtasks && subtask.subtasks.length > 0) {
                                        return { ...subtask, subtasks: updateSubtask(subtask.subtasks) };
                                    }
                                    return subtask;
                                });
                            };

                            if (card.subtasks && card.subtasks.length > 0) {
                                return { ...card, subtasks: updateSubtask(card.subtasks) };
                            }
                            return card;
                        }),
                    };
                });
            });
            return;
        }

        optimisticUpdate(
            `toggle-subtask-${subtaskId}`,
            () => {
                setColumns((prevColumns) => {
                    return prevColumns.map((column) => {
                        if (column.id !== columnId) return column;

                        return {
                            ...column,
                            cards: column.cards.map((card) => {
                                if (card.id !== cardId) return card;

                                const updateSubtask = (subtasks: Task[]): Task[] => {
                                    return subtasks.map((subtask) => {
                                        if (subtask.id === subtaskId) {
                                            return { ...subtask, done: done !== undefined ? done : !subtask.done };
                                        }
                                        if (subtask.subtasks && subtask.subtasks.length > 0) {
                                            return { ...subtask, subtasks: updateSubtask(subtask.subtasks) };
                                        }
                                        return subtask;
                                    });
                                };

                                if (card.subtasks && card.subtasks.length > 0) {
                                    return { ...card, subtasks: updateSubtask(card.subtasks) };
                                }
                                return card;
                            }),
                        };
                    });
                });
            },
            async () => {
                // Get current state to check done status
                const currentColumns = columnsRef.current;
                const task = findTaskInColumns(currentColumns, subtaskId);
                const currentDone = task?.task.done || false;

                return await apiUpdateTask(subtaskId, {
                    done: done !== undefined ? done : !currentDone,
                });
            }
        );
    }, [optimisticUpdate]);

    const addSubtask = useCallback((
        columnId: string,
        cardId: string,
        title: string,
        parentSubtaskId?: string
    ) => {
        const tempId = `temp-sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        optimisticUpdate(
            `add-subtask-${tempId}`,
            () => {
                setColumns((prevColumns) => {
                    const newColumns = [...prevColumns];
                    const column = newColumns.find((c) => c.id === columnId);
                    const root = column?.cards.find((c) => c.id === cardId);

                    if (!root) return prevColumns;

                    const makeChild = (p: Task): Task => ({
                        id: tempId,
                        title,
                        description: "",
                        priority: 'medium',
                        tags: [],
                        parentId: p.id,
                        isParent: false,
                        done: false,
                        subtasks: []
                    });

                    const ensureArray = (n: Task) => {
                        if (!n.subtasks) n.subtasks = [];
                    };

                    if (!parentSubtaskId) {
                        ensureArray(root);
                        root.isParent = true;
                        root.subtasks!.push(makeChild(root));
                        return newColumns;
                    }

                    const findAndInsert = (list: Task[]): boolean => {
                        for (const s of list) {
                            if (s.id === parentSubtaskId) {
                                ensureArray(s);
                                s.isParent = true;
                                s.subtasks!.push(makeChild(s));
                                return true;
                            }
                            if (s.subtasks && findAndInsert(s.subtasks)) return true;
                        }
                        return false;
                    };

                    if (root.subtasks) findAndInsert(root.subtasks);
                    return newColumns;
                });
            },
            async () => {
                const result = await apiCreateTask(columnId, title, {
                    parentTaskId: parentSubtaskId || cardId,
                    done: false,
                });

                // Update temp ID with real ID
                setColumns((prevColumns) => {
                    const newColumns = [...prevColumns];
                    const col = newColumns.find((c) => c.id === columnId);
                    const root = col?.cards.find((c) => c.id === cardId);

                    if (root?.subtasks) {
                        const updateSubtaskId = (list: Task[]): boolean => {
                            for (const s of list) {
                                if (s.id === tempId) {
                                    s.id = result.id;
                                    return true;
                                }
                                if (s.subtasks && updateSubtaskId(s.subtasks)) return true;
                            }
                            return false;
                        };
                        updateSubtaskId(root.subtasks);
                    }

                    return newColumns;
                });

                return result;
            }
        );
    }, [optimisticUpdate, columns]);

    const removeSubtask = useCallback((
        columnId: string,
        cardId: string,
        subtaskId: string
    ) => {
        optimisticUpdate(
            `remove-subtask-${subtaskId}`,
            () => {
                setColumns((prevColumns) => {
                    const newColumns = [...prevColumns];
                    const column = newColumns.find((c) => c.id === columnId);
                    const root = column?.cards.find((c) => c.id === cardId);

                    if (!root || !root.subtasks) return prevColumns;

                    const removeRecursive = (list: Task[]): boolean => {
                        const idx = list.findIndex((s) => s.id === subtaskId);
                        if (idx !== -1) {
                            list.splice(idx, 1);
                            return true;
                        }
                        for (const s of list) {
                            if (s.subtasks && removeRecursive(s.subtasks)) return true;
                        }
                        return false;
                    };

                    removeRecursive(root.subtasks);
                    return newColumns;
                });
            },
            async () => {
                await apiDeleteTask(subtaskId);
            }
        );
    }, [optimisticUpdate]);

    const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
        // Skip API call for temp IDs (tasks that haven't been created on backend yet)
        if (taskId.startsWith('temp-')) {
            // Just update locally, API call will happen after task is created
            setColumns((prevColumns) => {
                const newColumns = prevColumns.map((column) => ({
                    ...column,
                    cards: column.cards.map((task) => {
                        if (task.id === taskId) {
                            return { ...task, ...updates };
                        }
                        // Check subtasks recursively
                        if (task.subtasks && task.subtasks.length > 0) {
                            const updateSubtask = (subtasks: Task[]): Task[] => {
                                return subtasks.map((subtask) => {
                                    if (subtask.id === taskId) {
                                        return { ...subtask, ...updates };
                                    }
                                    if (subtask.subtasks && subtask.subtasks.length > 0) {
                                        return { ...subtask, subtasks: updateSubtask(subtask.subtasks) };
                                    }
                                    return subtask;
                                });
                            };
                            return { ...task, subtasks: updateSubtask(task.subtasks) };
                        }
                        return task;
                    }),
                }));
                return newColumns;
            });
            return;
        }

        optimisticUpdate(
            `update-task-${taskId}`,
            () => {
                setColumns((prevColumns) => {
                    const newColumns = prevColumns.map((column) => ({
                        ...column,
                        cards: column.cards.map((task) => {
                            if (task.id === taskId) {
                                return { ...task, ...updates };
                            }
                            // Check subtasks recursively
                            if (task.subtasks && task.subtasks.length > 0) {
                                const updateSubtask = (subtasks: Task[]): Task[] => {
                                    return subtasks.map((subtask) => {
                                        if (subtask.id === taskId) {
                                            return { ...subtask, ...updates };
                                        }
                                        if (subtask.subtasks && subtask.subtasks.length > 0) {
                                            return { ...subtask, subtasks: updateSubtask(subtask.subtasks) };
                                        }
                                        return subtask;
                                    });
                                };
                                return { ...task, subtasks: updateSubtask(task.subtasks) };
                            }
                            return task;
                        }),
                    }));
                    return newColumns;
                });
            },
            async () => {
                return await apiUpdateTask(taskId, {
                    title: updates.title,
                    description: updates.description,
                    priority: updates.priority,
                    tags: updates.tags,
                    dueDate: updates.dueDate,
                    done: updates.done,
                    isParent: updates.isParent,
                });
            }
        );
    }, [optimisticUpdate]);

    return (
        <KanbanContext.Provider
            value={{
                columns,
                boardId,
                itemId,
                isLoading,
                isError,
                error,
                moveCard,
                moveColumn,
                createTask,
                createColumn,
                updateColumn,
                deleteColumn,
                toggleSubtask,
                addSubtask,
                removeSubtask,
                updateTask,
                refetch: fetchBoard,
            }}
        >
            {children}
        </KanbanContext.Provider>
    );
};

