interface KANBAN_API_IDS {
  itemId?: string;
  columnId?: string;
  taskId?: string;
}

// Kanban APIs
export const KANBAN_APIS = (ids: KANBAN_API_IDS) => {
  return {
    // Get kanban board with columns and tasks
    GET_KANBAN_BOARD: `${import.meta.env.VITE_BACKEND_API}/playground/kanban/boards/${ids.itemId}`, // (required authentication)
    
    // Create kanban board (usually auto-created, but available for manual creation)
    CREATE_KANBAN_BOARD: `${import.meta.env.VITE_BACKEND_API}/playground/kanban/boards`, // (required authentication)
    
    // --------> Column APIs <--------
    // Create a column
    CREATE_COLUMN: `${import.meta.env.VITE_BACKEND_API}/playground/kanban/columns`, // (required authentication)
    // Update a column
    UPDATE_COLUMN: `${import.meta.env.VITE_BACKEND_API}/playground/kanban/columns/${ids.columnId}`, // (required authentication)
    // Delete a column
    DELETE_COLUMN: `${import.meta.env.VITE_BACKEND_API}/playground/kanban/columns/${ids.columnId}`, // (required authentication)
    // Reorder a column
    REORDER_COLUMN: `${import.meta.env.VITE_BACKEND_API}/playground/kanban/columns/${ids.columnId}/reorder`, // (required authentication)
    
    // --------> Task APIs <--------
    // Create a task
    CREATE_TASK: `${import.meta.env.VITE_BACKEND_API}/playground/kanban/tasks`, // (required authentication)
    // Update a task
    UPDATE_TASK: `${import.meta.env.VITE_BACKEND_API}/playground/kanban/tasks/${ids.taskId}`, // (required authentication)
    // Delete a task
    DELETE_TASK: `${import.meta.env.VITE_BACKEND_API}/playground/kanban/tasks/${ids.taskId}`, // (required authentication)
    // Move a task between columns or positions
    MOVE_TASK: `${import.meta.env.VITE_BACKEND_API}/playground/kanban/tasks/${ids.taskId}/move`, // (required authentication)
  }
};

