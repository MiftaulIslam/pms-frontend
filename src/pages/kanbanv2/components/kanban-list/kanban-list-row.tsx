import { cn } from "@/lib/utils";
import type { Task } from "@/pages/kanbanv2/types";
import React from "react";
import { Flag } from "lucide-react";
import { priorityColorClass } from "./priority";
import { useTaskDetails } from "../../context/task-details-context";

interface KanbanListRowProps {
  card: Task;
  columnId: string;
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onMouseMove: (e: React.MouseEvent) => void;
}

const KanbanListRow: React.FC<KanbanListRowProps> = ({
  card,
  columnId,
  isDragging,
  onMouseDown,
  onMouseUp,
  onMouseMove,
}) => {
  const { openTask } = useTaskDetails();
  const dragStartPosRef = React.useRef<{ x: number; y: number } | null>(null);
  const hasDraggedRef = React.useRef(false);
  const mouseMoveHandlerRef = React.useRef<((e: MouseEvent) => void) | null>(null);
  const mouseUpHandlerRef = React.useRef<(() => void) | null>(null);
  
  const handleMouseDownLocal = React.useCallback((e: React.MouseEvent) => {
    if (isDragging) return
    
    // Don't start drag if clicking on interactive elements
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('input') || target.closest('a')) {
      return
    }
    
    // Clean up any existing listeners first
    if (mouseMoveHandlerRef.current) {
      document.removeEventListener('mousemove', mouseMoveHandlerRef.current);
      mouseMoveHandlerRef.current = null;
    }
    if (mouseUpHandlerRef.current) {
      document.removeEventListener('mouseup', mouseUpHandlerRef.current);
      mouseUpHandlerRef.current = null;
    }
    
    e.stopPropagation();
    dragStartPosRef.current = { x: e.clientX, y: e.clientY };
    hasDraggedRef.current = false;

    const handleMouseMove = (event: MouseEvent) => {
      if (!dragStartPosRef.current || hasDraggedRef.current) return;
      
      const dragDistance = Math.sqrt(
        Math.pow(event.clientX - dragStartPosRef.current.x, 2) + 
        Math.pow(event.clientY - dragStartPosRef.current.y, 2)
      );
      
      // If mouse moved more than 10px, start dragging
      if (dragDistance > 10) {
        hasDraggedRef.current = true;
        
        // Remove our mouseup listener since parent will handle it
        if (mouseUpHandlerRef.current) {
          document.removeEventListener('mouseup', mouseUpHandlerRef.current);
          mouseUpHandlerRef.current = null;
        }
        
        const rowElement = event.target as HTMLElement
        const syntheticEvent = {
          clientX: dragStartPosRef.current.x,
          clientY: dragStartPosRef.current.y,
          target: rowElement,
          currentTarget: rowElement,
          preventDefault: () => {},
          stopPropagation: () => {},
        } as unknown as React.MouseEvent;
        onMouseDown(syntheticEvent);
        
        // Remove mousemove listener since drag system will handle it
        if (mouseMoveHandlerRef.current) {
          document.removeEventListener('mousemove', mouseMoveHandlerRef.current);
          mouseMoveHandlerRef.current = null;
        }
      }
    };

    const handleMouseUpGlobal = () => {
      if (dragStartPosRef.current && !hasDraggedRef.current) {
        // This was a click, not a drag - open task modal
        openTask(card, columnId);
      }
      // If hasDraggedRef.current is true, the parent component will handle the drop logic
      // so we don't call onMouseUp here - let the parent's drag end handler do it
      
      // Clean up our listeners
      if (mouseMoveHandlerRef.current) {
        document.removeEventListener('mousemove', mouseMoveHandlerRef.current);
        mouseMoveHandlerRef.current = null;
      }
      if (mouseUpHandlerRef.current) {
        document.removeEventListener('mouseup', mouseUpHandlerRef.current);
        mouseUpHandlerRef.current = null;
      }
      
      dragStartPosRef.current = null;
      hasDraggedRef.current = false;
    };

    // Store handlers in refs
    mouseMoveHandlerRef.current = handleMouseMove;
    mouseUpHandlerRef.current = handleMouseUpGlobal;

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseup', handleMouseUpGlobal);
  }, [card, columnId, onMouseDown, onMouseUp, openTask, isDragging]);
  
  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (mouseMoveHandlerRef.current) {
        document.removeEventListener('mousemove', mouseMoveHandlerRef.current);
      }
      if (mouseUpHandlerRef.current) {
        document.removeEventListener('mouseup', mouseUpHandlerRef.current);
      }
    };
  }, []);
  return (
    <div
      className={cn(
        "grid grid-cols-[1fr_160px_160px_140px_40px] items-center gap-2 px-4 py-2 cursor-grab select-none",
        isDragging && "opacity-50"
      )}
      onMouseDown={handleMouseDownLocal}
      onMouseMove={onMouseMove}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm">{card.title}</span>
      </div>
      <div className="text-xs text-muted-foreground">
        {card.assignee ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center">
              <span className="text-[10px] font-medium text-white">
                {card.assignee.charAt(0).toUpperCase()}
              </span>
            </div>
            {card.assignee}
          </div>
        ) : (
          <span>—</span>
        )}
      </div>
      <div className="text-xs text-muted-foreground">—</div>
      <div className="flex items-center">
        {card.priority && (
          <Flag className={cn("w-4 h-4", priorityColorClass(card.priority as any))} />
        )}
      </div>
      <div></div>
    </div>
  );
};

export default KanbanListRow;