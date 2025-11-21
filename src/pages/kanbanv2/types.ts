export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority?: Priority;
  assignee?: string;
  tags?: string[];
  dueDate?: string;
  // hierarchy
  parentId?: string | null;
  isParent?: boolean; // true if has or can have children
  done?: boolean; // completion flag for both tasks and subtasks
  subtasks?: Task[]; // nested tasks
}

export interface KanbanColumnData {
  id: string;
  title: string;
  cards: Task[];
  color?: string;
}
