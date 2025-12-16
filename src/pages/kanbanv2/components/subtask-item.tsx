import React, { useState } from 'react'
import { CheckCircle2, Circle, Plus, X, CalendarDays, Link2 } from 'lucide-react'
import { useKanban } from '../context'
import { priorityColorClass } from '@/pages/kanbanv2/components/kanban-list/priority'
import { cn } from '@/lib/utils'
import type { Task } from '@/pages/kanbanv2/types'

interface SubtaskItemProps {
  node: Task
  columnId: string
  cardId: string
  depth?: number
}

const SubtaskItem: React.FC<SubtaskItemProps> = ({ node, columnId, cardId }) => {
  const { addSubtask: addSubtaskAction, removeSubtask: removeSubtaskAction, toggleSubtask: toggleSubtaskAction } = useKanban()
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')

  const iconColor = priorityColorClass(node.priority)

  return (
    <div className={cn('relative group rounded-md border border-border/40 bg-background/40 p-3')}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 text-sm">
          {node.done ? (
            <CheckCircle2 className="w-4 h-4 text-primary" />
          ) : (
            <Circle className="w-4 h-4 text-muted-foreground" />
          )}
          <span className={cn('truncate', node.done && 'line-through text-muted-foreground/70')}>{node.title}</span>
        </div>
        {/* Hover Actions */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          <button
            className="h-6 w-6 inline-flex items-center justify-center rounded hover:bg-secondary"
            title={node.done ? 'Mark as undone' : 'Mark as done'}
            onClick={(e) => { e.stopPropagation(); toggleSubtaskAction(columnId, cardId, node.id) }}
          >
            <CheckCircle2 className="w-4 h-4" />
          </button>
          <button
            className="h-6 w-6 inline-flex items-center justify-center rounded hover:bg-secondary"
            title="Remove subtask"
            onClick={(e) => { e.stopPropagation(); removeSubtaskAction(columnId, cardId, node.id) }}
          >
            <X className="w-4 h-4" />
          </button>
          <button
            className="h-6 w-6 inline-flex items-center justify-center rounded hover:bg-secondary"
            title="Add child subtask"
            onClick={(e) => { e.stopPropagation(); setAdding(v => !v) }}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Meta row */}
      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
        {node.assignee && (
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 rounded-full bg-gradient-primary flex items-center justify-center text-[10px] text-white">
              {node.assignee.charAt(0).toUpperCase()}
            </div>
            <span className="truncate max-w-[120px]">{node.assignee}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <CalendarDays className="w-4 h-4" />
          {node.dueDate ? <span>{node.dueDate}</span> : <span>—</span>}
        </div>
        <div className={cn('flex items-center gap-1', iconColor)}>
          <span className="w-2 h-2 rounded-full bg-current" />
          <span className="capitalize">{node.priority ?? 'low'}</span>
        </div>
      </div>

      {/* Add child composer */}
      {adding && (
        <div className="mt-2 flex items-center gap-2">
          <input
            className="flex-1 text-sm bg-transparent outline-none border-b border-border/40 focus:border-primary/50 py-1"
            placeholder="Add child subtask..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && title.trim()) {
                e.preventDefault();
                addSubtaskAction(columnId, cardId, title.trim(), node.id)
                setTitle('')
                setAdding(false)
              }
            }}
          />
          <button
            className="h-6 px-2 text-xs rounded hover:bg-secondary"
            onClick={() => { if (title.trim()) { addSubtaskAction(columnId, cardId, title.trim(), node.id); setTitle(''); setAdding(false) }}}
          >Add</button>
        </div>
      )}

      {/* Footer summary for nested children (no expand) */}
      {node.subtasks && node.subtasks.length > 0 && (
        <div className="mt-2 w-full flex items-center justify-between text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <Link2 className="w-3 h-3" />
            <span>{node.subtasks.length} subtask{node.subtasks.length > 1 ? 's' : ''}</span>
          </span>
          <span className="inline-flex items-center gap-1">
            {(() => {
              const total = node.subtasks?.length ?? 0
              const done = node.subtasks?.filter(s => s.done)?.length ?? 0
              return (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  {done}/{total}
                </>
              )
            })()}
          </span>
        </div>
      )}
    </div>
  )
}

export default SubtaskItem
