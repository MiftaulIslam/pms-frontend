import { SimpleModalProvider, SimpleModalContent } from '@/components/common/simple-modal/simple-modal';
import { useTaskDetails } from '../context/task-details-context';
import { TaskDetailsContent } from './task-details-content';

export function TaskDetailsModal() {
  const { isOpen, closeTask, selectedTask } = useTaskDetails();

  return (
    <SimpleModalProvider open={isOpen} onOpenChange={closeTask}>
      <SimpleModalContent
        title={selectedTask?.title || 'Task Details'}
        description=""
        footerCancel={false}
      >
        <TaskDetailsContent />
      </SimpleModalContent>
    </SimpleModalProvider>
  );
}

