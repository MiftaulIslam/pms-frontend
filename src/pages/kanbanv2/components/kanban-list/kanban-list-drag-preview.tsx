import type { Task } from '@/pages/kanbanv2/types';
import { Badge } from '@/components/ui/badge';

const KanbanListDragPreview = ({card}: {card: Task}) => {
  return (
    <div className="grid grid-cols-[1fr_160px_160px_140px_40px] items-center gap-2 px-4 py-2 rounded-md border bg-card shadow-sm">
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
    <div>
      {card.priority && (
        <Badge variant="outline" className="text-xs capitalize">
          {card.priority}
        </Badge>
      )}
    </div>
    <div></div>
  </div>
  )
}

export default KanbanListDragPreview