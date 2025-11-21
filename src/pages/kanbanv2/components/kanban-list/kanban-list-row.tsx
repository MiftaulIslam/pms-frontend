import { cn } from "@/lib/utils";
import type { Task } from "@/pages/kanbanv2/types";
import React from "react";
import { Flag } from "lucide-react";
import { priorityColorClass } from "./priority";

interface KanbanListRowProps {
  card: Task;
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onMouseMove: (e: React.MouseEvent) => void;
}

const KanbanListRow: React.FC<KanbanListRowProps> = ({
  card,
  isDragging,
  onMouseDown,
  onMouseUp,
  onMouseMove,
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-[1fr_160px_160px_140px_40px] items-center gap-2 px-4 py-2 cursor-grab select-none",
        isDragging && "opacity-50"
      )}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
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