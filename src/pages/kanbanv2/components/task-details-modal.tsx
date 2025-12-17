import { SimpleModalProvider, SimpleModalContent, SimpleModalHeader } from '@/components/common/simple-modal/simple-modal';
import { useTaskDetails } from '../context/task-details-context';
import { TaskDetailsContent } from './task-details-content';
import { Button } from '@/components/ui/button';
import { X, Lock, Eye, Share2, MoreHorizontal, Maximize2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCallback } from 'react';

export function TaskDetailsModal() {
  const { isOpen, closeTask, selectedTask } = useTaskDetails();

  const handleStatusChange = useCallback((newStatus: string) => {
    // TODO: Implement status change
    console.log('Status changed to:', newStatus);
  }, []);

  return (
    <SimpleModalProvider className='min-w-[80vw]' open={isOpen} onOpenChange={closeTask}>
      <SimpleModalContent
        className="max-w-[90vw] w-full h-[90vh] flex flex-col p-0"
        footerCancel={false}
        headerContent={
          <SimpleModalHeader className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Add epic</span>
              <span className="text-sm font-medium">{selectedTask?.id || 'CRE-108'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Select value="in-progress" onValueChange={handleStatusChange}>
                <SelectTrigger className="h-8 w-[120px]">
                  <SelectValue>In Progress</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Lock className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Eye className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center">1</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={closeTask}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SimpleModalHeader>
        }
      >
        <div className="flex-1 overflow-hidden">
          <TaskDetailsContent />
        </div>
      </SimpleModalContent>
    </SimpleModalProvider>
  );
}

