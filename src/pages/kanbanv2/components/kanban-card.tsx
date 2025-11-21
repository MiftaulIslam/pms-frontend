import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DragItem } from "@/hooks/use-drag-and-drop";
import { CheckCircle2, ChevronDown, Link2, Plus } from "lucide-react";
import { useState } from "react";
import { useKanban } from "../context/kanban-context";
import SubtaskItem from "./subtask-item";
import type { Task, Priority } from "@/pages/kanbanv2/types";

interface KanbanCardProps {
  card: Task;
  columnId: string;
  index: number;
  isDragging?: boolean;
  onDragStart: (item: DragItem, event: React.MouseEvent) => void;
  onDragEnd: () => void;
}

const priorityColors: Record<Exclude<Priority, undefined>, string> = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-red-100 text-red-800 border-red-200',
  urgent: 'bg-purple-100 text-purple-800 border-purple-200',
};

export const KanbanCard = ({ 
  card, 
  columnId, 
  index, 
  isDragging,
  onDragStart,
  onDragEnd 
}: KanbanCardProps) => {
  const [expanded, setExpanded] = useState(false)
  const [newSubtask, setNewSubtask] = useState("")
  const { addSubtask: addSubtaskAction } = useKanban()
  const handleMouseDown = (event: React.MouseEvent) => {
    onDragStart({ id: card.id, columnId, index }, event);
  };

  const handleMouseUp = () => {
    onDragEnd();
  };

  const totalSubtasks = card.subtasks?.length ?? 0
  const doneSubtasks = card.subtasks?.filter(s => s.done).length ?? 0

  return (
    <Card
      className={cn(
        "p-4 cursor-grab active:cursor-grabbing select-none",
        "bg-gradient-card dark:bg-none dark:!bg-card",
        "transition-all duration-200 ease-smooth",
        "border border-border/50",
        isDragging && "opacity-50 rotate-1 scale-105"
      )}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-card-foreground leading-tight">
            {card.title}
          </h4>
          {card.priority && (
            <Badge 
              variant="outline"
              className={cn("text-xs shrink-0", priorityColors[card.priority])}
            >
              {card.priority}
            </Badge>
          )}
        </div>
        
        {card.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {card.description}
          </p>
        )}

        {card.tags && card.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {card.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {card.assignee && (
          <div className="flex items-center gap-2 pt-1">
            <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center">
              <span className="text-xs font-medium text-white">
                {card.assignee.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{card.assignee}</span>
          </div>
        )}

        {totalSubtasks > 0 && (
          <button
            type="button"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); setExpanded(v => !v) }}
            className="w-full flex items-center justify-between text-xs text-muted-foreground hover:text-foreground"
          >
            <span className="inline-flex items-center gap-2">
              <ChevronDown className={cn("w-3 h-3 transition-transform", expanded ? "rotate-180" : "rotate-0")} />
              <Link2 className="w-3 h-3" />
              <span>
                {totalSubtasks} subtask{totalSubtasks > 1 ? 's' : ''}
              </span>
            </span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {doneSubtasks}/{totalSubtasks}
            </span>
          </button>
        )}

        {/* Expanded subtasks INSIDE the card using recursive component */}
        {expanded && (
          <div className="mt-2 space-y-2">
            {card.subtasks?.map((s) => (
              <SubtaskItem key={s.id} node={s} columnId={columnId} cardId={card.id} />
            ))}
            {/* Root-level add composer */}
            <div className="flex items-center gap-2">
              <button
                className="h-6 w-6 inline-flex items-center justify-center rounded hover:bg-secondary"
                title="Add subtask"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (newSubtask.trim()) { addSubtaskAction(columnId, card.id, newSubtask.trim()); setNewSubtask(""); } }}
              >
                <Plus className="w-4 h-4" />
              </button>
              <input
                className="flex-1 text-sm bg-transparent outline-none border-b border-border/40 focus:border-primary/50 py-1"
                placeholder="Add subtask..."
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newSubtask.trim()) {
                    e.preventDefault();
                    addSubtaskAction(columnId, card.id, newSubtask.trim());
                    setNewSubtask("");
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
    
  );
}
;