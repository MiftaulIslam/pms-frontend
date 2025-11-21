// import { Badge } from "@/components/ui/badge";
// import { Card } from "@/components/ui/card";
// import { cn } from "@/lib/utils";
import { type DragItem } from "@/hooks/use-drag-and-drop";
import type { KanbanColumnData } from "@/pages/kanbanv2/types";
// import { useState } from "react";
// import { ChevronDown, ChevronRight, Plus, Check, Trash2, Flag, Calendar, Users } from "lucide-react";
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useAppDispatch } from "@/store/store";
// import { createTask } from "@/store/slices/kanbanv2/kanbanv2-slice";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import KanbanListColumn from "./kanban-list/kanban-list-column";

interface KanbanListProps {
  columns: KanbanColumnData[];
  draggedItem: DragItem | null;
  dragOverColumn: string | null;
  onDragStart: (item: DragItem, event: React.MouseEvent) => void;
  onDragEnd: () => void;
  onDragOver: (columnId: string, index?: number) => void;
  onDragLeave: () => void;
  shouldShowDropIndicator: (columnId: string, index: number) => boolean;
}

// const DropIndicator = () => (
//   <div className="h-0.5 bg-blue-400 rounded-full mx-1 my-1 animate-pulse" />
// );

export const KanbanList = ({
  columns,
  draggedItem,
  dragOverColumn,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  shouldShowDropIndicator,
}: KanbanListProps) => {
  // const dispatch = useAppDispatch();
  // const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  // const [composer, setComposer] = useState<{ columnId: string | null; position: 'top' | 'bottom' }>({ columnId: null, position: 'bottom' });
  // const [newTitle, setNewTitle] = useState("");
  // const [newPriority, setNewPriority] = useState<'low'|'medium'|'high'|'none'>('none');

  // const handleRowDragOver = (columnId: string, index: number) => (event: React.MouseEvent) => {
  //   event.preventDefault();
  //   const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  //   const midY = rect.top + rect.height / 2;
  //   const targetIndex = event.clientY > midY ? index + 1 : index;
  //   onDragOver(columnId, targetIndex);
  // };

  // const handleSectionEnter = (columnId: string, hasCards: boolean) => (event: React.MouseEvent | React.DragEvent) => {
  //   event.preventDefault();
  //   onDragOver(columnId, hasCards ? undefined : 0);
  // };

  // const handleSectionLeave = (event: React.MouseEvent | React.DragEvent) => {
  //   const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  //   const x = (event as any).clientX;
  //   const y = (event as any).clientY;
  //   if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
  //     onDragLeave();
  //   }
  // };

  return (
    <div className="space-y-2 px-2">
    {columns.map((col) => (
      <KanbanListColumn
        key={col.id}
        col={col}
        draggedItem={draggedItem}
        dragOverColumn={dragOverColumn}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        shouldShowDropIndicator={shouldShowDropIndicator}
      />
    ))}
  </div>
    // <div className="space-y-8 px-2">
    //   {columns.map((col: KanbanListColumnData, index: number) => {
    //     const isDropTarget = dragOverColumn === col.id;
    //     const isCollapsed = !!collapsed[col.id];
    //     return (
    //       <section key={col.id}>
    //         <Collapsible
    //           open={!isCollapsed}
    //           onOpenChange={(open) => setCollapsed((s) => ({ ...s, [col.id]: !open }))}
    //         >
    //           <CollapsibleTrigger asChild>
    //             <div
    //               className={cn(
    //                 "flex items-center justify-between gap-2 mb-2 select-none cursor-pointer",
    //                 isDropTarget && "text-foreground"
    //               )}
    //             >
    //               <div className="flex items-center gap-2">
    //                 {!isCollapsed ? (
    //                   <ChevronDown className="w-4 h-4" />
    //                 ) : (
    //                   <ChevronRight className="w-4 h-4" />
    //                 )}
    //                 <Badge variant="secondary" className={cn("text-xs", col.color)}>
    //                   {col.title}
    //                 </Badge>
    //                 <span className="text-xs text-muted-foreground">{col.cards.length}</span>
    //               </div>
    //               <div className="flex items-center gap-2">
    //                 <Button
    //                   variant="ghost"
    //                   size="sm"
    //                   onClick={(e) => {
    //                     e.preventDefault();
    //                     e.stopPropagation();
    //                     setComposer({ columnId: col.id, position: 'top' });
    //                     setNewTitle("");
    //                   }}
    //                 >
    //                   <Plus className="w-4 h-4 mr-1" /> Add Task
    //                 </Button>
    //               </div>
    //             </div>
    //           </CollapsibleTrigger>

    //           <CollapsibleContent className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-1 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-1 overflow-hidden pl-6">
    //             <Card
    //               className={cn(
    //                 "w-full overflow-hidden border-0 bg-transparent",
    //                 isDropTarget && "bg-kanban-drop-zone border-kanban-indicator"
    //               )}
    //               onMouseOver={handleSectionEnter(col.id, col.cards.length > 0)}
    //               onMouseEnter={handleSectionEnter(col.id, col.cards.length > 0)}
    //               onMouseLeave={handleSectionLeave}
    //             >
    //               {/* Header */}
    //               <div className="grid grid-cols-[1fr_160px_160px_140px_40px] items-center gap-2 px-4 py-2 text-xs text-muted-foreground border-b">
    //                 <div>Name</div>
    //                 <div>Assignee</div>
    //                 <div>Due date</div>
    //                 <div></div>
    //               </div>

    //               {/* Top Composer */}
    //               {composer.columnId === col.id && composer.position === 'top' && (
    //               <div className="grid grid-cols-[1fr_160px_160px_140px_40px] items-center gap-2 px-4 py-2 border-b bg-background/40">
    //                 <div className="flex items-center gap-2">
    //                   <Input
    //                     autoFocus
    //                     value={newTitle}
    //                     onChange={(e) => setNewTitle(e.target.value)}
    //                     placeholder="Task title"
    //                     className="h-7 max-w-[520px]"
    //                   />
    //                 </div>
    //                 <div className="flex items-center gap-1">
    //                   <Select value={newPriority} onValueChange={(v: any) => setNewPriority(v)}>
    //                     <SelectTrigger className="h-7 w-9 px-0">
    //                       <Flag className="w-4 h-4 mx-auto" />
    //                     </SelectTrigger>
    //                     <SelectContent align="start">
    //                       <SelectItem value="none">None</SelectItem>
    //                       <SelectItem value="low">Low</SelectItem>
    //                       <SelectItem value="medium">Medium</SelectItem>
    //                       <SelectItem value="high">High</SelectItem>
    //                     </SelectContent>
    //                   </Select>
    //                   <Button variant="ghost" size="icon" className="h-7 w-7">
    //                     <Calendar className="w-4 h-4" />
    //                   </Button>
    //                   <Button variant="ghost" size="icon" className="h-7 w-7">
    //                     <Users className="w-4 h-4" />
    //                   </Button>
    //                   <Button
    //                     size="icon"
    //                     className="h-7 w-7"
    //                     onClick={() => {
    //                       if (!newTitle.trim()) return;
    //                       dispatch(createTask({ columnId: col.id, title: newTitle.trim(), position: 'top', priority: newPriority === 'none' ? undefined : newPriority }));
    //                       setComposer({ columnId: null, position: 'bottom' });
    //                       setNewTitle("");
    //                       setNewPriority('none');
    //                     }}
    //                   >
    //                     <Check className="w-4 h-4" />
    //                   </Button>
    //                   <Button
    //                     size="icon"
    //                     variant="ghost"
    //                     className="h-7 w-7"
    //                     onClick={() => {
    //                       setComposer({ columnId: null, position: 'bottom' });
    //                       setNewTitle("");
    //                       setNewPriority('none');
    //                     }}
    //                   >
    //                     <Trash2 className="w-4 h-4" />
    //                   </Button>
    //                 </div>
    //               </div>
    //             )}
    //               {/* Rows */}
    //               <div className="divide-y">
    //                 {shouldShowDropIndicator(col.id, 0) && <DropIndicator />}
    //                 {col.cards.map((card, index) => {
    //                   const isDragging = draggedItem?.id === card.id && draggedItem?.columnId === col.id;
    //                   return (
    //                     <div key={card.id}>
    //                       <div
    //                         className={cn(
    //                           "grid grid-cols-[1fr_160px_160px_140px_40px] items-center gap-2 px-4 py-2 cursor-grab select-none",
    //                           isDragging && "opacity-50"
    //                         )}
    //                         onMouseDown={(e) => onDragStart({ id: card.id, columnId: col.id, index }, e)}
    //                         onMouseUp={onDragEnd}
    //                         onMouseMove={handleRowDragOver(col.id, index)}
    //                       >
    //                         <div className="flex items-center gap-2">
    //                           <span className="text-sm">{card.title}</span>
    //                         </div>
    //                         <div className="text-xs text-muted-foreground">
    //                           {card.assignee ? (
    //                             <div className="flex items-center gap-2">
    //                               <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center">
    //                                 <span className="text-[10px] font-medium text-white">
    //                                   {card.assignee.charAt(0).toUpperCase()}
    //                                 </span>
    //                               </div>
    //                               {card.assignee}
    //                             </div>
    //                           ) : (
    //                             <span>—</span>
    //                           )}
    //                         </div>
    //                         <div className="text-xs text-muted-foreground">—</div>
    //                         <div>
    //                           {card.priority && (
    //                             <Badge variant="outline" className="text-xs capitalize">
    //                               {card.priority}
    //                             </Badge>
    //                           )}
    //                         </div>
    //                         <div></div>
    //                       </div>
    //                       {shouldShowDropIndicator(col.id, index + 1) && <DropIndicator />}
    //                     </div>
    //                   );
    //                 })}
    //               </div>

    //               {/* Bottom composer / Add link */}
    //               {composer.columnId === col.id && composer.position === 'bottom' ? (
    //                 <div className="grid grid-cols-[1fr_160px_160px_140px_40px] items-center gap-2 px-4 py-2 bg-background/40">
    //                   <div className="flex items-center gap-2">
    //                     <Input
    //                       autoFocus
    //                       value={newTitle}
    //                       onChange={(e) => setNewTitle(e.target.value)}
    //                       placeholder="Task title"
    //                       className="h-7 max-w-[520px]"
    //                     />
    //                   </div>
    //                   <div className="flex items-center gap-1">
    //                     <Select value={newPriority} onValueChange={(v: any) => setNewPriority(v)}>
    //                       <SelectTrigger className="h-7 w-9 px-0">
    //                         <Flag className="w-4 h-4 mx-auto" />
    //                       </SelectTrigger>
    //                       <SelectContent align="start">
    //                         <SelectItem value="none">None</SelectItem>
    //                         <SelectItem value="low">Low</SelectItem>
    //                         <SelectItem value="medium">Medium</SelectItem>
    //                         <SelectItem value="high">High</SelectItem>
    //                       </SelectContent>
    //                     </Select>
    //                     <Button variant="ghost" size="icon" className="h-7 w-7">
    //                       <Calendar className="w-4 h-4" />
    //                     </Button>
    //                     <Button variant="ghost" size="icon" className="h-7 w-7">
    //                       <Users className="w-4 h-4" />
    //                     </Button>
    //                   </div>
    //                   <div className="text-xs text-muted-foreground">—</div>
    //                   <div className="flex items-center gap-1">
    //                     <Button
    //                       size="icon"
    //                       className="h-7 w-7"
    //                       onClick={() => {
    //                         if (!newTitle.trim()) return;
    //                         dispatch(createTask({ columnId: col.id, title: newTitle.trim(), position: 'bottom', priority: newPriority === 'none' ? undefined : newPriority }));
    //                         setComposer({ columnId: null, position: 'bottom' });
    //                         setNewTitle("");
    //                         setNewPriority('none');
    //                       }}
    //                     >
    //                       <Check className="w-4 h-4" />
    //                     </Button>
    //                     <Button
    //                       size="icon"
    //                       variant="ghost"
    //                       className="h-7 w-7"
    //                       onClick={() => {
    //                         setComposer({ columnId: null, position: 'bottom' });
    //                         setNewTitle("");
    //                         setNewPriority('none');
    //                       }}
    //                     >
    //                       <Trash2 className="w-4 h-4" />
    //                     </Button>
    //                   </div>
    //                 </div>
    //               ) : (
    //                 <div
    //                   className="px-4 py-3 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
    //                   onClick={() => {
    //                     setComposer({ columnId: col.id, position: 'bottom' });
    //                     setNewTitle("");
    //                   }}
    //                   onMouseOver={() => onDragOver(col.id, 0)}
    //                 >
    //                   + Add task
    //                 </div>
    //               )}
    //             </Card>
    //           </CollapsibleContent>
    //         </Collapsible>

    //         {/* Keep a drop area even when collapsed */}
    //         {isCollapsed && (
    //           <div className="h-2" onMouseOver={() => onDragOver(col.id, 0)} />
    //         )}
    //       </section>
    //     );
    //   })}
    // </div>
  );
};
