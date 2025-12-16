import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Settings, Plus, Check, Trash2 } from "lucide-react";
import { KanbanCard } from "./kanban-card";
import { type DragItem } from "@/hooks/use-drag-and-drop";
import { useKanban } from "../context";
import DropIndicator from "./drop-indicator";
import type { KanbanColumnData } from "@/pages/kanbanv2/types";

interface KanbanColumnProps {
  column: KanbanColumnData;
  draggedItem: DragItem | null;
  dragOverColumn: string | null;
  dragOverIndex: number | null;
  onDragStart: (item: DragItem, event: React.MouseEvent) => void;
  onDragEnd: () => void;
  onDragOver: (columnId: string, index?: number) => void;
  onDragLeave: () => void;
  shouldShowDropIndicator: (columnId: string, index: number) => boolean;
}



export const KanbanColumn = ({
  column,
  draggedItem,
  dragOverColumn,
  // dragOverIndex,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  shouldShowDropIndicator,
}: KanbanColumnProps) => {
  const { createTask: createTaskAction } = useKanban();
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>("medium");
  const isDropTarget = dragOverColumn === column.id;

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    // For empty columns, set index to 0
    const targetIndex = column.cards.length === 0 ? 0 : undefined;
    onDragOver(column.id, targetIndex);
  };

  const handleDragEnter = (event: React.DragEvent) => {
    event.preventDefault();
    // For empty columns, set index to 0
    const targetIndex = column.cards.length === 0 ? 0 : undefined;
    onDragOver(column.id, targetIndex);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    // Only trigger drag leave if we're leaving the column entirely
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      onDragLeave();
    }
  };

  const handleCardDragOver = (index: number) => (event: React.MouseEvent) => {
    event.preventDefault();
    // Decide whether the drop target is before or after this card
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const targetIndex = event.clientY > midY ? index + 1 : index;
    onDragOver(column.id, targetIndex);
  };

  return (
    <div className="flex flex-col w-80 shrink-0">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          {column.title}
          <Badge variant="secondary" className="text-xs">
            {column.cards.length}
          </Badge>
        </h3>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => { /* no-op settings */ }}
          className="h-8 w-8 p-0 hover:bg-secondary"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      <Card
        className={cn(
          "p-4 bg-kanban-column shadow-column",
          "border border-border/30 min-h-[200px]",
          "transition-all duration-200",
          isDropTarget && "bg-kanban-drop-zone border-kanban-indicator"
        )}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <div className="space-y-3">
          {/* Drop indicator at the top */}
          {shouldShowDropIndicator(column.id, 0) && <DropIndicator />}

          {column.cards.map((card, index) => {
            const isDragging = 
              draggedItem?.id === card.id && draggedItem?.columnId === column.id;

            return (
              <div key={card.id}>
                <div
                  onMouseMove={handleCardDragOver(index)}
                  className="transition-all duration-200"
                >
                  <KanbanCard
                    card={card}
                    columnId={column.id}
                    index={index}
                    isDragging={isDragging}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                  />
                </div>
                
                {/* Drop indicator after each card */}
                {shouldShowDropIndicator(column.id, index + 1) && <DropIndicator />}
              </div>
            );
          })}

          {/* Empty state */}
          {column.cards.length === 0 && (
            <div 
              className="flex items-center justify-center h-32 text-muted-foreground"
              onMouseOver={() => onDragOver(column.id, 0)}
            >
              <p className="text-sm">Drop cards here</p>
            </div>
          )}
        </div>

        {/* Inline Task Composer at bottom */}
        {isCreateTaskOpen && (
          <div className="mt-3 rounded-md border border-border/40 bg-background/40 p-3">
            <p className="text-sm font-medium mb-2">What needs to be done?</p>
            <textarea
              className="w-full resize-y rounded-md border border-border/40 bg-background/60 p-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              rows={3}
              placeholder="Type your task..."
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
            />
            <div className="mt-2 flex items-center justify-between gap-2">
              <Select value={newTaskPriority} onValueChange={(v: 'low' | 'medium' | 'high') => setNewTaskPriority(v)}>
                <SelectTrigger className="h-8 w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  className="h-8 px-2"
                  onClick={() => {
                    if (!newTaskText.trim()) return;
                    createTaskAction(column.id, newTaskText.trim(), undefined, newTaskPriority);
                    setNewTaskText("");
                    setNewTaskPriority("medium");
                    setIsCreateTaskOpen(false);
                  }}
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 px-2"
                  onClick={() => {
                    setNewTaskText("");
                    setNewTaskPriority("medium");
                    setIsCreateTaskOpen(false);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Create Task Button */}
        {!isCreateTaskOpen && (
          <div className="mt-3">
            <Button
              variant="ghost"
              onClick={() => setIsCreateTaskOpen(true)}
              className="w-full justify-start text-muted-foreground hover:text-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              + Create
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};