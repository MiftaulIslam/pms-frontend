import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Task } from '../types';

interface TaskDetailsContextType {
  selectedTask: Task | null;
  selectedColumnId: string | null;
  isOpen: boolean;
  openTask: (task: Task, columnId: string) => void;
  closeTask: () => void;
}

const TaskDetailsContext = createContext<TaskDetailsContextType | undefined>(undefined);

export function useTaskDetails() {
  const context = useContext(TaskDetailsContext);
  if (!context) {
    throw new Error('useTaskDetails must be used within TaskDetailsProvider');
  }
  return context;
}

export function TaskDetailsProvider({ children }: { children: ReactNode }) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openTask = useCallback((task: Task, columnId: string) => {
    setSelectedTask(task);
    setSelectedColumnId(columnId);
    setIsOpen(true);
  }, []);

  const closeTask = useCallback(() => {
    setIsOpen(false);
    // Clear task after animation
    setTimeout(() => {
      setSelectedTask(null);
      setSelectedColumnId(null);
    }, 200);
  }, []);

  return (
    <TaskDetailsContext.Provider
      value={{
        selectedTask,
        selectedColumnId,
        isOpen,
        openTask,
        closeTask,
      }}
    >
      {children}
    </TaskDetailsContext.Provider>
  );
}

