import { apiClient } from '@/lib/api/axios-instance';
import { KANBAN_APIS } from './kanban-api';
import type { KanbanColumnData, Task, Priority } from '../types';

// Backend response types (as received from API)
interface BackendKanbanTask {
    id: string;
    title: string;
    description?: string;
    priority?: Priority;
    assignee?: string;
    assigneeId?: string;
    tags?: string[];
    dueDate?: string;
    parentId?: string | null;
    isParent?: boolean;
    done?: boolean;
    subtasks?: BackendKanbanTask[];
}

interface BackendKanbanColumn {
    id: string;
    title: string;
    color?: string | null;
    position: number;
    cards: BackendKanbanTask[];
}

export interface BackendKanbanBoard {
    id: string;
    itemId: string;
    columns: BackendKanbanColumn[];
    createdAt: string;
    updatedAt: string;
}

/**
 * Transforms backend task structure to frontend Task format
 * Handles nested subtasks recursively
 */
function transformTask(backendTask: BackendKanbanTask): Task {
    return {
        id: backendTask.id,
        title: backendTask.title,
        description: backendTask.description,
        priority: backendTask.priority,
        assignee: backendTask.assignee,
        tags: backendTask.tags || [],
        dueDate: backendTask.dueDate,
        parentId: backendTask.parentId,
        isParent: backendTask.isParent || false,
        done: backendTask.done || false,
        subtasks: backendTask.subtasks?.map(transformTask) || [],
    };
}

/**
 * Transforms backend kanban board response to frontend structure
 * Converts backend format to KanbanColumnData[]
 */
export function transformKanbanBoardToFrontend(backendBoard: BackendKanbanBoard): KanbanColumnData[] {
    return backendBoard.columns.map((column) => ({
        id: column.id,
        title: column.title,
        color: column.color || undefined,
        cards: column.cards.map(transformTask),
    }));
}

/**
 * Fetches kanban board for an item (returns full board data)
 */
export async function getKanbanBoardFull(itemId: string): Promise<BackendKanbanBoard> {
    const response = await apiClient.get<BackendKanbanBoard>(
        KANBAN_APIS({ itemId }).GET_KANBAN_BOARD
    );

    return response.data;
}

/**
 * Fetches kanban board for an item and transforms to frontend structure
 */
export async function getKanbanBoard(itemId: string): Promise<KanbanColumnData[]> {
    const board = await getKanbanBoardFull(itemId);
    return transformKanbanBoardToFrontend(board);
}

/**
 * Creates a kanban board for an item
 */
export async function createKanbanBoard(itemId: string): Promise<BackendKanbanBoard> {
    const response = await apiClient.post<BackendKanbanBoard>(
        KANBAN_APIS({}).CREATE_KANBAN_BOARD,
        { itemId }
    );

    return response.data;
}

/**
 * Creates a new column in a kanban board
 */
export async function createColumn(
    kanbanBoardId: string,
    title: string,
    color?: string
): Promise<BackendKanbanColumn> {
    const response = await apiClient.post<BackendKanbanColumn>(
        KANBAN_APIS({}).CREATE_COLUMN,
        {
            kanbanBoardId,
            title,
            color: color || null,
        }
    );

    return response.data;
}

/**
 * Updates a column
 */
export async function updateColumn(
    columnId: string,
    updates: { title?: string; color?: string | null }
): Promise<BackendKanbanColumn> {
    const response = await apiClient.patch<BackendKanbanColumn>(
        KANBAN_APIS({ columnId }).UPDATE_COLUMN,
        updates
    );

    return response.data;
}

/**
 * Deletes a column
 */
export async function deleteColumn(columnId: string): Promise<void> {
    await apiClient.delete(KANBAN_APIS({ columnId }).DELETE_COLUMN);
}

/**
 * Reorders a column within the kanban board
 */
export async function reorderColumn(columnId: string, position: number): Promise<BackendKanbanColumn> {
    const response = await apiClient.patch<BackendKanbanColumn>(
        KANBAN_APIS({ columnId }).REORDER_COLUMN,
        { position }
    );

    return response.data;
}

/**
 * Creates a new task in a kanban column
 * Can create subtasks by specifying parentTaskId
 */
export async function createTask(
    kanbanColumnId: string,
    title: string,
    options?: {
        description?: string;
        priority?: Priority;
        assigneeId?: string;
        dueDate?: string;
        parentTaskId?: string;
        tags?: string[];
        done?: boolean;
    }
): Promise<BackendKanbanTask> {
    const response = await apiClient.post<BackendKanbanTask>(
        KANBAN_APIS({}).CREATE_TASK,
        {
            kanbanColumnId,
            title,
            description: options?.description || null,
            priority: options?.priority || null,
            assigneeId: options?.assigneeId || null,
            dueDate: options?.dueDate || null,
            parentTaskId: options?.parentTaskId || null,
            tags: options?.tags || null,
            done: options?.done || false,
        }
    );

    return response.data;
}

/**
 * Updates a task
 */
export async function updateTask(
    taskId: string,
    updates: {
        title?: string;
        description?: string | null;
        priority?: Priority | null;
        assigneeId?: string | null;
        dueDate?: string | null;
        tags?: string[] | null;
        done?: boolean;
        isParent?: boolean;
    }
): Promise<BackendKanbanTask> {
    const response = await apiClient.patch<BackendKanbanTask>(
        KANBAN_APIS({ taskId }).UPDATE_TASK,
        updates
    );

    return response.data;
}

/**
 * Deletes a task
 */
export async function deleteTask(taskId: string): Promise<void> {
    await apiClient.delete(KANBAN_APIS({ taskId }).DELETE_TASK);
}

/**
 * Moves a task between columns or changes its position
 */
export async function moveTask(
    taskId: string,
    kanbanColumnId: string,
    position: number
): Promise<BackendKanbanTask> {
    const response = await apiClient.patch<BackendKanbanTask>(
        KANBAN_APIS({ taskId }).MOVE_TASK,
        {
            kanbanColumnId,
            position,
        }
    );

    return response.data;
}

