import { Button } from "@/components/ui/button";
import { Plus, List as ListIcon, LayoutGrid, Search, EyeOff, Settings, ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import { useDragAndDrop } from "@/hooks/use-drag-and-drop";
import { useKanban, KanbanProvider } from "./context/kanban-context-api";
import { useKanbanItemId } from "./hooks/use-kanban-item";
import { useCallback } from "react";
import type { DragItem } from "@/hooks/use-drag-and-drop";
import { useEffect } from "react";
import { KanbanColumn } from "./components/kanban-column";
import { KanbanCard } from "./components/kanban-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KanbanList } from "./components/kanban-list";
import KanbanListDragPreview from "./components/kanban-list/kanban-list-drag-preview";
import CustomizePanel from "./components/kanban-customization/customize-panel";
import ColumnDndSheet from "./components/kanban-customization/column-dnd-sheet";

const Kanbanv2Content = () => {
  const { columns, moveCard: moveCardAction, isLoading } = useKanban();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  // Initialize tab from query (?list=true -> list, otherwise board)
  const getTabFromQuery = (): "list" | "board" => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get("list") === "true" ? "list" : "board";
    } catch {
      return "board";
    }
  };
  const [activeTab, setActiveTab] = useState<"list" | "board">(getTabFromQuery());
  const boardRef = useRef<HTMLDivElement>(null);
  const [customizeOpen, setCustomizeOpen] = useState(false);

  const {
    dragState,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    shouldShowDropIndicator,
  } = useDragAndDrop();

  const moveCardHandler = useCallback(
    (
      cardId: string,
      sourceColumnId: string,
      targetColumnId: string,
      targetIndex: number
    ) => {
      moveCardAction(cardId, sourceColumnId, targetColumnId, targetIndex);
    },
    [moveCardAction]
  );

  const handleDragStartWrapper = useCallback(
    (item: DragItem, event: React.MouseEvent) => {
      // Ensure the preview appears at the current cursor immediately
      const { clientX, clientY } = event;
      // Use rAF to guarantee paint order across browsers before the preview renders
      requestAnimationFrame(() => {
        setMousePosition({ x: clientX, y: clientY });
      });
      handleDragStart(item, event);
    },
    [handleDragStart]
  );

  const handleDragEndWrapper = useCallback(() => {
    if (dragState.draggedItem && dragState.dragOverColumn !== null) {
      // For empty columns or when dragOverIndex is null, use 0 as the target index
      const targetIndex = dragState.dragOverIndex ?? 0;

      moveCardHandler(
        dragState.draggedItem.id,
        dragState.draggedItem.columnId,
        dragState.dragOverColumn,
        targetIndex
      );
    }

    handleDragEnd();
    // Reset preview position to avoid residual flicker on next drag
    setMousePosition({ x: -9999, y: -9999 });
  }, [dragState, moveCardHandler, handleDragEnd]);

  // Keep URL in sync with tab selection
  useEffect(() => {
    const url = new URL(window.location.href);
    if (activeTab === "list") {
      url.searchParams.set("list", "true");
    } else {
      url.searchParams.delete("list");
    }
    window.history.replaceState({}, "", url.toString());
  }, [activeTab]);

  // Support back/forward navigation to reflect query state
  useEffect(() => {
    const onPopState = () => {
      setActiveTab(getTabFromQuery());
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Handle mouse movement for drag preview
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (dragState.isDragging) {
        setMousePosition({ x: event.clientX, y: event.clientY });
      }
    };

    if (dragState.isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleDragEndWrapper);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleDragEndWrapper);
    };
  }, [dragState.isDragging, handleDragEndWrapper]);

  // Find the dragged card for preview
  const draggedCard = dragState.draggedItem
    ? columns
        .find((col) => col.id === dragState.draggedItem?.columnId)
        ?.cards.find((card) => card.id === dragState.draggedItem?.id)
    : null;

  return (
    <div className="min-h-screen">
      <div className="">
        <div className="flex items-center justify-between px-2 border-b">
          <div className="flex items-center gap-2">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "list" | "board")}>
              <TabsList className="bg-transparent p-0 h-9">
                <TabsTrigger
                  value="list"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                >
                  <ListIcon className="w-4 h-4 mr-2" />
                  List
                </TabsTrigger>
                <TabsTrigger
                  value="board"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                >
                  <LayoutGrid className="w-4 h-4 mr-2" />
                  Board
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="ghost" size="sm" className="ml-1">
              <Plus className="w-4 h-4 mr-1" />
              View
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button variant="ghost" size="sm">
              <EyeOff className="w-4 h-4 mr-2" />
              Hide
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => setCustomizeOpen(prev => !prev)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Customize
            </Button>
            <Button size="sm" className="ml-2">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
            <Button variant="ghost" size="sm">
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="relative">
          {/* Customization panel over board area */}
          <CustomizePanel open={customizeOpen} onClose={() => setCustomizeOpen(false)} title="Customize Board" width={380}>
            <ColumnDndSheet />
          </CustomizePanel>

          <div className="w-full h-full">
            {isLoading ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-muted-foreground">Loading board...</div>
              </div>
            ) : activeTab === "board" ? (
              <div
                ref={boardRef}
                className="flex items-start gap-6 p-6 overflow-x-auto h-full"
              >
                {columns.map((column) => (
                  <KanbanColumn
                    key={column.id}
                    column={column}
                    draggedItem={dragState.draggedItem}
                    dragOverColumn={dragState.dragOverColumn}
                    dragOverIndex={dragState.dragOverIndex}
                    onDragStart={handleDragStartWrapper}
                    onDragEnd={handleDragEndWrapper}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    shouldShowDropIndicator={shouldShowDropIndicator}
                  />
                ))}
              </div>
            ) : (
              <KanbanList
                columns={columns}
                draggedItem={dragState.draggedItem}
                dragOverColumn={dragState.dragOverColumn}
                onDragStart={handleDragStartWrapper}
                onDragEnd={handleDragEndWrapper}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                shouldShowDropIndicator={shouldShowDropIndicator}
              />
            )}

            {/* Drag Preview */}
            {dragState.isDragging && draggedCard && (
              <div
                className="fixed pointer-events-none z-50 opacity-95"
                style={{ left: mousePosition.x - (activeTab === "list" ? 200 : 100), top: mousePosition.y - (activeTab === "list" ? 28 : 50) }}
              >
                {activeTab === "list" ? (
                  <KanbanListDragPreview card={draggedCard} />
                ) : (
                  <KanbanCard
                    card={draggedCard}
                    columnId=""
                    index={-1}
                    isDragging={true}
                    onDragStart={() => {}}
                    onDragEnd={() => {}}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

const Kanbanv2 = () => {
  const itemId = useKanbanItemId();
  
  return (
    <KanbanProvider itemId={itemId}>
      <Kanbanv2Content />
    </KanbanProvider>
  );
};

export default Kanbanv2;
