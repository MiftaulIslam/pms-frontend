import React, { useCallback, useState } from 'react'
import { useKanban } from '../../context/kanban-context'
import { useDragAndDrop } from '@/hooks/use-drag-and-drop'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GripVertical, Check, Trash2 } from 'lucide-react'
import DropIndicator from '../drop-indicator'

const AREA_ID = 'columns'

const ColumnDndSheet = () => {
  const { columns, createColumn, moveColumn } = useKanban()

  const { dragState, handleDragStart, handleDragEnd, handleDragOver, shouldShowDropIndicator } = useDragAndDrop()

  const [adding, setAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  // const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // const draggedColumn = useMemo(() => {
  //   if (!dragState.draggedItem) return null
  //   return columns[dragState.draggedItem.index] ?? null
  // }, [columns, dragState.draggedItem])

  const finalizeDrop = useCallback(() => {
    if (!dragState.isDragging || !dragState.draggedItem) return

    const fromIndex = dragState.draggedItem.index
    const toIndexRaw = dragState.dragOverIndex ?? fromIndex

    // Adjust when dragging downwards within same list
    const toIndex = toIndexRaw > fromIndex ? toIndexRaw - 1 : toIndexRaw

    if (toIndex !== fromIndex) {
      moveColumn(dragState.draggedItem.id, Math.max(0, Math.min(toIndex, columns.length - 1)))
    }
    handleDragEnd()
  }, [columns.length, moveColumn, dragState.dragOverIndex, dragState.draggedItem, dragState.isDragging, handleDragEnd])

  const onAddConfirm = useCallback(() => {
    const title = newTitle.trim()
    if (!title) return
    createColumn(title, columns.length)
    setNewTitle('')
    setAdding(false)
  }, [columns.length, createColumn, newTitle])

  return (
    <div className="space-y-4 select-none" onMouseUp={finalizeDrop} 
    // onMouseMove={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}
    >
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">Columns</h4>
        <div className="rounded-md border">
          {/* Top drop indicator */}
          {shouldShowDropIndicator(AREA_ID, 0) && <DropIndicator />}

          {columns.map((col, index) => (
            <React.Fragment key={col.id}>
              <div
                className={`flex items-center gap-3 px-3 py-2 border-b last:border-b-0 bg-background ${dragState.draggedItem?.id === col.id ? 'opacity-60' : ''}`}
                onMouseMove={(event) => {
                  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
                  const midY = rect.top + rect.height / 2
                  const targetIndex = event.clientY > midY ? index + 1 : index
                  handleDragOver(AREA_ID, targetIndex)
                }}
              >
                <div
                  className="cursor-grab active:cursor-grabbing text-muted-foreground"
                  onMouseDown={(e) => handleDragStart({ id: col.id, columnId: AREA_ID, index }, e)}
                  title="Drag to reorder"
                >
                  <GripVertical size={16} />
                </div>
                <div className="flex-1 text-sm">{col.title}</div>
              </div>

              {/* Drop indicator after each row */}
              {shouldShowDropIndicator(AREA_ID, index + 1) && <DropIndicator />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Add Column */}
      <div className="pt-2">
        {!adding ? (
          <Button variant="ghost" size="sm" onClick={() => setAdding(true)}>
            + Add column
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Input
              value={newTitle}
              autoFocus
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="New column name"
            />
            <Button size="icon" variant="secondary" onClick={onAddConfirm} title="Create">
              <Check size={18} />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => { setAdding(false); setNewTitle('') }} title="Cancel">
              <Trash2 size={18} />
            </Button>
          </div>
        )}
      </div>

      {/* Drag preview like main board approach */}
      {/* {dragState.isDragging && draggedColumn && (
        <div
          className="fixed pointer-events-none z-50 opacity-95"
          style={{ left: mousePosition.x - 120, top: mousePosition.y - 18 }}
        >
          <div className="flex items-center gap-3 px-3 py-2 rounded-md border bg-background shadow-sm">
            <div className="text-muted-foreground">
              <GripVertical size={16} />
            </div>
            <div className="flex-1 text-sm font-medium">{draggedColumn.title}</div>
          </div>
        </div>
      )} */}
    </div>
  )
}

export default ColumnDndSheet