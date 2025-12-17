import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { KanbanColumnData, Task, Priority } from '../types';
import { initialKanbanData } from './initial-data';

interface KanbanContextType {
  columns: KanbanColumnData[];
  moveCard: (cardId: string, sourceColumnId: string, targetColumnId: string, targetIndex: number) => void;
  moveColumn: (columnId: string, newIndex: number) => void;
  createTask: (columnId: string, title: string, description?: string, priority?: Priority, position?: 'top' | 'bottom') => void;
  updateTask: (columnId: string, cardId: string, updates: Partial<Task>) => void;
  createColumn: (title: string, position?: number) => void;
  updateColumn: (columnId: string, title: string) => void;
  deleteColumn: (columnId: string) => void;
  toggleSubtask: (columnId: string, cardId: string, subtaskId: string, done?: boolean) => void;
  addSubtask: (columnId: string, cardId: string, title: string, parentSubtaskId?: string) => void;
  removeSubtask: (columnId: string, cardId: string, subtaskId: string) => void;
  loadFromStorage: (data: KanbanColumnData[]) => void;
  resetBoard: () => void;
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
}

export const KanbanProvider = ({ children }: KanbanProviderProps) => {
  const [columns, setColumns] = useState<KanbanColumnData[]>(initialKanbanData);

  const moveCard = useCallback((
    cardId: string,
    sourceColumnId: string,
    targetColumnId: string,
    targetIndex: number
  ) => {
    setColumns((prevColumns) => {
      const newColumns = [...prevColumns];
      
      // Find source and target columns
      const sourceColumnIndex = newColumns.findIndex((col) => col.id === sourceColumnId);
      const targetColumnIndex = newColumns.findIndex((col) => col.id === targetColumnId);
      
      if (sourceColumnIndex === -1 || targetColumnIndex === -1) return prevColumns;
      
      // Find and remove the card from source column
      const cardIndex = newColumns[sourceColumnIndex].cards.findIndex((card) => card.id === cardId);
      
      if (cardIndex === -1) return prevColumns;
      
      const [movedCard] = newColumns[sourceColumnIndex].cards.splice(cardIndex, 1);

      // Adjust target index when moving within the same column and moving downward
      let adjustedTargetIndex = targetIndex;
      if (sourceColumnIndex === targetColumnIndex && targetIndex > cardIndex) {
        adjustedTargetIndex = targetIndex - 1;
      }

      // Clamp to valid range for target column length
      const clampedTargetIndex = Math.max(
        0,
        Math.min(adjustedTargetIndex, newColumns[targetColumnIndex].cards.length)
      );

      // Insert into target column at computed index
      newColumns[targetColumnIndex].cards.splice(clampedTargetIndex, 0, movedCard);
      
      return newColumns;
    });
  }, []);

  const moveColumn = useCallback((columnId: string, newIndex: number) => {
    setColumns((prevColumns) => {
      const columnIndex = prevColumns.findIndex((col) => col.id === columnId);
      
      if (columnIndex === -1 || newIndex < 0 || newIndex >= prevColumns.length) return prevColumns;
      
      const newColumns = [...prevColumns];
      const [movedColumn] = newColumns.splice(columnIndex, 1);
      newColumns.splice(newIndex, 0, movedColumn);
      
      return newColumns;
    });
  }, []);

  const createTask = useCallback((
    columnId: string,
    title: string,
    description?: string,
    priority?: Priority,
    position: 'top' | 'bottom' = 'bottom'
  ) => {
    setColumns((prevColumns) => {
      const columnIndex = prevColumns.findIndex((col) => col.id === columnId);
      
      if (columnIndex === -1) return prevColumns;
      
      const newTask: Task = {
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title,
        description: description || "",
        priority: priority || 'medium',
        assignee: 'You',
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
  }, []);

  const updateTask = useCallback((
    columnId: string,
    cardId: string,
    updates: Partial<Task>
  ) => {
    setColumns((prevColumns) => {
      const newColumns = [...prevColumns];
      const column = newColumns.find((c) => c.id === columnId);
      const task = column?.cards.find((c) => c.id === cardId);
      
      if (!task) return prevColumns;
      
      // Update task properties
      Object.assign(task, updates);
      
      return newColumns;
    });
  }, []);

  const createColumn = useCallback((title: string, position?: number) => {
    setColumns((prevColumns) => {
      const newColumn: KanbanColumnData = {
        id: `column-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title,
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
  }, []);

  const updateColumn = useCallback((columnId: string, title: string) => {
    setColumns((prevColumns) => {
      const columnIndex = prevColumns.findIndex(col => col.id === columnId);
      
      if (columnIndex === -1) return prevColumns;
      
      const newColumns = [...prevColumns];
      newColumns[columnIndex] = { ...newColumns[columnIndex], title };
      
      return newColumns;
    });
  }, []);

  const deleteColumn = useCallback((columnId: string) => {
    setColumns((prevColumns) => prevColumns.filter(col => col.id !== columnId));
  }, []);

  const toggleSubtask = useCallback((
    columnId: string,
    cardId: string,
    subtaskId: string,
    done?: boolean
  ) => {
    setColumns((prevColumns) => {
      const newColumns = [...prevColumns];
      const column = newColumns.find((c) => c.id === columnId);
      const root = column?.cards.find((c) => c.id === cardId);
      
      if (!root) return prevColumns;
      
      const toggleRecursive = (list: Task[]): boolean => {
        for (const s of list) {
          if (s.id === subtaskId) {
            s.done = done !== undefined ? done : !s.done;
            return true;
          }
          if (s.subtasks && toggleRecursive(s.subtasks)) return true;
        }
        return false;
      };
      
      if (root.subtasks) toggleRecursive(root.subtasks);
      
      return newColumns;
    });
  }, []);

  const addSubtask = useCallback((
    columnId: string,
    cardId: string,
    title: string,
    parentSubtaskId?: string
  ) => {
    setColumns((prevColumns) => {
      const newColumns = [...prevColumns];
      const column = newColumns.find((c) => c.id === columnId);
      const root = column?.cards.find((c) => c.id === cardId);
      
      if (!root) return prevColumns;
      
      const makeChild = (p: Task): Task => ({
        id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title,
        description: "",
        priority: 'medium',
        assignee: 'You',
        dueDate: undefined,
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
  }, []);

  const removeSubtask = useCallback((
    columnId: string,
    cardId: string,
    subtaskId: string
  ) => {
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
  }, []);

  const loadFromStorage = useCallback((data: KanbanColumnData[]) => {
    setColumns(data);
  }, []);

  const resetBoard = useCallback(() => {
    setColumns(initialKanbanData);
  }, []);

  return (
    <KanbanContext.Provider
      value={{
        columns,
        moveCard,
        moveColumn,
        createTask,
        updateTask,
        createColumn,
        updateColumn,
        deleteColumn,
        toggleSubtask,
        addSubtask,
        removeSubtask,
        loadFromStorage,
        resetBoard,
      }}
    >
      {children}
    </KanbanContext.Provider>
  );
};
