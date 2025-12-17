import { useState, useCallback } from 'react';
import { SimpleModalContent, SimpleModalProvider } from '@/components/common/simple-modal/simple-modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GripVertical, Plus, X, Check } from 'lucide-react';
import { useDragAndDrop } from '@/hooks/use-drag-and-drop';

interface ListColumn {
  id: string;
  title: string;
  position: number;
  isNew?: boolean;
}

interface ListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; description?: string; columns: Array<{ title: string; position: number; color?: string | null }> }) => Promise<void>;
  isLoading?: boolean;
}

const AREA_ID = 'list-columns';

// Default columns
const DEFAULT_COLUMNS: Omit<ListColumn, 'id'>[] = [
  { title: 'To Do', position: 0 },
  { title: 'In Progress', position: 1 },
  { title: 'Done', position: 2 },
];

// Generate random color for columns
const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];
const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

export function ListModal({ open, onOpenChange, onSubmit, isLoading = false }: ListModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [addingColumn, setAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [columns, setColumns] = useState<ListColumn[]>(() => {
    return DEFAULT_COLUMNS.map((col, index) => ({
      ...col,
      id: `default-${index}`,
    }));
  });

  const { dragState, handleDragStart, handleDragEnd, handleDragOver, shouldShowDropIndicator } = useDragAndDrop();

  const moveColumn = useCallback((fromIndex: number, toIndex: number) => {
    setColumns((prev) => {
      const newColumns = [...prev];
      const [moved] = newColumns.splice(fromIndex, 1);
      newColumns.splice(toIndex, 0, moved);
      return newColumns.map((col, index) => ({
        ...col,
        position: index,
      }));
    });
  }, []);

  const addColumn = useCallback((title: string) => {
    setColumns((prev) => {
      const newColumn: ListColumn = {
        id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: title.trim() || 'New Column',
        position: prev.length,
        isNew: true,
      };
      return [...prev, newColumn];
    });
  }, []);

  const removeColumn = useCallback((id: string) => {
    setColumns((prev) => {
      const column = prev.find((col) => col.id === id);
      if (column && !column.isNew) {
        return prev; // Don't remove default columns
      }
      const filtered = prev.filter((col) => col.id !== id);
      return filtered.map((col, index) => ({
        ...col,
        position: index,
      }));
    });
  }, []);

  const finalizeDrop = useCallback(() => {
    if (!dragState.isDragging || !dragState.draggedItem) return;

    const fromIndex = dragState.draggedItem.index;
    const toIndexRaw = dragState.dragOverIndex ?? fromIndex;

    const toIndex = toIndexRaw > fromIndex ? toIndexRaw - 1 : toIndexRaw;

    if (toIndex !== fromIndex) {
      moveColumn(fromIndex, Math.max(0, Math.min(toIndex, columns.length - 1)));
    }
    handleDragEnd();
  }, [columns.length, moveColumn, dragState.dragOverIndex, dragState.draggedItem, dragState.isDragging, handleDragEnd]);

  const handleAddColumn = useCallback(() => {
    const title = newColumnTitle.trim();
    if (!title) return;
    addColumn(title);
    setNewColumnTitle('');
    setAddingColumn(false);
  }, [newColumnTitle, addColumn]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('List name is required');
      return;
    }

    setError('');
    try {
      // Convert columns to API format
      const columnsData = columns.map((col) => ({
        title: col.title,
        position: col.position,
        color: col.isNew ? getRandomColor() : null, // Random color for new columns
      }));

      await onSubmit({ 
        name: name.trim(), 
        description: description.trim() || undefined,
        columns: columnsData,
      });
      
      // Reset form on success
      setName('');
      setDescription('');
      setColumns(DEFAULT_COLUMNS.map((col, index) => ({
        ...col,
        id: `default-${index}`,
      })));
      setAddingColumn(false);
      setNewColumnTitle('');
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create list');
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setError('');
    setColumns(DEFAULT_COLUMNS.map((col, index) => ({
      ...col,
      id: `default-${index}`,
    })));
    setAddingColumn(false);
    setNewColumnTitle('');
    onOpenChange(false);
  };

  return (
    <SimpleModalProvider open={open} onOpenChange={handleClose}>
      <SimpleModalContent
        title="Create List"
        description="Create a new list with custom columns"
        footerCancel={true}
        footerSubmit="Create"
        footerSubmitLoading={isLoading}
        onFooterSubmitClick={handleSubmit}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="list-name" className="text-sm font-medium">
              List Name
            </label>
            <Input
              id="list-name"
              placeholder="Enter list name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="list-description" className="text-sm font-medium">
              Description (Optional)
            </label>
            <textarea
              id="list-description"
              placeholder="Enter list description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Columns</label>
            </div>
            <div className="rounded-md border" onMouseUp={finalizeDrop}>
              {/* Top drop indicator */}
              {shouldShowDropIndicator(AREA_ID, 0) && (
                <div className="h-0.5 bg-primary mx-2" />
              )}

              {columns.map((col, index) => (
                <div key={col.id}>
                  <div
                    className={`flex items-center gap-3 px-3 py-2 border-b last:border-b-0 bg-background hover:bg-accent/50 transition-colors ${
                      dragState.draggedItem?.id === col.id ? 'opacity-60' : ''
                    }`}
                    onMouseMove={(event) => {
                      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
                      const midY = rect.top + rect.height / 2;
                      const targetIndex = event.clientY > midY ? index + 1 : index;
                      handleDragOver(AREA_ID, targetIndex);
                    }}
                  >
                    <div
                      className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
                      onMouseDown={(e) => handleDragStart({ id: col.id, columnId: AREA_ID, index }, e)}
                      title="Drag to reorder"
                    >
                      <GripVertical size={16} />
                    </div>
                    <div className="flex-1 text-sm font-medium">{col.title}</div>
                    {col.isNew && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeColumn(col.id)}
                        title="Remove column"
                      >
                        <X size={14} />
                      </Button>
                    )}
                  </div>

                  {/* Drop indicator after each row */}
                  {shouldShowDropIndicator(AREA_ID, index + 1) && (
                    <div className="h-0.5 bg-primary mx-2" />
                  )}
                </div>
              ))}
            </div>

            {/* Add Column */}
            <div className="pt-2">
              {!addingColumn ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAddingColumn(true)}
                  disabled={isLoading}
                  className="w-full justify-start"
                >
                  <Plus size={16} />
                  Add More
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Input
                    value={newColumnTitle}
                    autoFocus
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                    placeholder="New column name"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddColumn();
                      } else if (e.key === 'Escape') {
                        setAddingColumn(false);
                        setNewColumnTitle('');
                      }
                    }}
                    disabled={isLoading}
                  />
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={handleAddColumn}
                    title="Add column"
                    disabled={isLoading || !newColumnTitle.trim()}
                  >
                    <Check size={16} />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setAddingColumn(false);
                      setNewColumnTitle('');
                    }}
                    title="Cancel"
                    disabled={isLoading}
                  >
                    <X size={16} />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      </SimpleModalContent>
    </SimpleModalProvider>
  );
}
