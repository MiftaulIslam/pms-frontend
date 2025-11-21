import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
// import { useAppDispatch } from "@/store/store";
// import { createTask } from "@/store/slices/kanbanv2/kanbanv2-slice";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { type DragItem } from "@/hooks/use-drag-and-drop";
import KanbanListRow from "./kanban-list-row";
import KanbanListComposer from "./kanban-list-composer";
import type { KanbanColumnData } from "@/pages/kanbanv2/types";
import DropIndicator from "../drop-indicator";

interface Props {
  col: KanbanColumnData;
  draggedItem: DragItem | null;
  dragOverColumn: string | null;
  onDragStart: (item: DragItem, event: React.MouseEvent) => void;
  onDragEnd: () => void;
  onDragOver: (columnId: string, index?: number) => void;
  onDragLeave: () => void;
  shouldShowDropIndicator: (columnId: string, index: number) => boolean;
}

const KanbanListColumn: React.FC<Props> = ({
  col,
  draggedItem,
  dragOverColumn,
  onDragStart,
  onDragEnd,
  onDragOver,
  // onDragLeave,
  shouldShowDropIndicator,
}) => {
  // const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(true);
  const [composer, setComposer] = React.useState<{ open: boolean; position: "top" | "bottom" }>({
    open: false,
    position: "bottom",
  });
  // const [newTitle, setNewTitle] = React.useState("");
  // const [newPriority, setNewPriority] = React.useState<"low" | "medium" | "high" | "none">("none");

  const isDropTarget = dragOverColumn === col.id;

  const handleRowDragOver =
    (columnId: string, index: number) => (event: React.MouseEvent) => {
      event.preventDefault();
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      const targetIndex = (event).clientY > midY ? index + 1 : index;
      onDragOver(columnId, targetIndex);
    };

  // const handleSectionEnter =
  //   (columnId: string, hasCards: boolean) =>
  //   (event: React.MouseEvent | React.DragEvent) => {
  //     event.preventDefault();
  //     onDragOver(columnId, hasCards ? undefined : 0);
  //   };

  // const handleSectionLeave = (event: React.MouseEvent | React.DragEvent) => {
  //   const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  //   const x = (event as any).clientX;
  //   const y = (event as any).clientY;
  //   if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
  //     onDragLeave();
  //   }
  // };

  // const DropIndicator = () => (
  //   <div className="h-0.5 bg-blue-400 rounded-full mx-1 my-1 animate-pulse" />
  // );

  return (
    <section>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <div
            className={cn(
              "flex items-center gap-2 select-none cursor-pointer",
              isDropTarget && "text-foreground"
            )}
          >
            <div className="flex items-center gap-2">
              {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              <Badge variant="secondary" className={cn("text-xs", col.color)}>
                {col.title}
              </Badge>
              <span className="text-xs text-muted-foreground">{col.cards.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setComposer({ open: true, position: "top" });
                  // setNewTitle("");
                  // setNewPriority("none");
                }}
              >
                <Plus className="w-4 h-4 mr-1" /> Add Task
              </Button>
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-1 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-1 overflow-hidden pl-6">
          {/* Header */}
          <div className="grid grid-cols-[1fr_160px_160px_140px_40px] items-center gap-2 px-4 py-2 text-xs text-muted-foreground border-b">
            <div>Name</div>
            <div>Assignee</div>
            <div>Due date</div>
            <div>Priority</div>
          </div>

          {/* Top Composer */}
          {composer.open && composer.position === "top" && (
            <KanbanListComposer
            col={col}
            setComposer={setComposer}
            position="top"
              // title={newTitle}
              // onTitleChange={setNewTitle}
              // priority={newPriority}
              // onPriorityChange={(v) => setNewPriority(v as any)}
              // onConfirm={() => {
              //   if (!newTitle.trim()) return;
              //   dispatch(
              //     createTask({
              //       columnId: col.id,
              //       title: newTitle.trim(),
              //       position: "top",
              //       priority: newPriority === "none" ? undefined : newPriority,
              //     })
              //   );
              //   setComposer({ open: false, position: "bottom" });
              //   setNewTitle("");
              //   setNewPriority("none");
              // }}
              // onCancel={() => {
              //   setComposer({ open: false, position: "bottom" });
              //   setNewTitle("");
              //   setNewPriority("none");
              // }}
            />
          )}

          {/* Rows */}
          <div className="divide-y">
            {shouldShowDropIndicator(col.id, 0) && <DropIndicator />}
            {col.cards.map((card, index) => {
              const isDragging =
                draggedItem?.id === card.id && draggedItem?.columnId === col.id;
              return (
                <div key={card.id}>
                  <KanbanListRow
                    card={card}
                    isDragging={!!isDragging}
                    onMouseDown={(e) => onDragStart({ id: card.id, columnId: col.id, index }, e)}
                    onMouseUp={onDragEnd}
                    onMouseMove={handleRowDragOver(col.id, index)}
                  />
                  {shouldShowDropIndicator(col.id, index + 1) && <DropIndicator />}
                </div>
              );
            })}
          </div>

          {/* Bottom composer / Add link */}
          {composer.open && composer.position === "bottom" ? (
            <KanbanListComposer
            
            col={col}
            setComposer={setComposer}
            position="bottom"
              // title={newTitle}
              // onTitleChange={setNewTitle}
              // priority={newPriority}
              // onPriorityChange={(v) => setNewPriority(v as any)}
              // onConfirm={() => {
              //   if (!newTitle.trim()) return;
              //   dispatch(
              //     createTask({
              //       columnId: col.id,
              //       title: newTitle.trim(),
              //       position: "bottom",
              //       priority: newPriority === "none" ? undefined : newPriority,
              //     })
              //   );
              //   setComposer({ open: false, position: "bottom" });
              //   setNewTitle("");
              //   setNewPriority("none");
              // }}
              // onCancel={() => {
              //   setComposer({ open: false, position: "bottom" });
              //   setNewTitle("");
              //   setNewPriority("none");
              // }}
            />
          ) : (
            <div
              className="px-4 py-3 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={() => {
                setComposer({ open: true, position: "bottom" });
                // setNewTitle("");
                // setNewPriority("none");
              }}
              onMouseOver={() => onDragOver(col.id, 0)}
            >
              + Add task
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Keep a drop area even when collapsed */}
      {!open && <div className="h-2" onMouseOver={() => onDragOver(col.id, 0)} />}
    </section>
  );
};

export default KanbanListColumn;