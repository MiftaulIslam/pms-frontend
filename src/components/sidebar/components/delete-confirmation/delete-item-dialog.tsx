import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  itemName: string;
  itemType?: 'list' | 'doc' | 'whiteboard';
  isLoading?: boolean;
}

export function DeleteItemDialog({
  open,
  onOpenChange,
  onConfirm,
  itemName,
  itemType = 'list',
  isLoading = false,
}: DeleteItemDialogProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const itemTypeLabel = itemType === 'list' ? 'List' : itemType === 'doc' ? 'Document' : 'Whiteboard';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {itemTypeLabel}</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-destructive">
                    This action cannot be undone
                  </p>
                  <p className="text-sm text-muted-foreground">
                    This will permanently delete the {itemTypeLabel.toLowerCase()} <strong>"{itemName}"</strong> and all of its associated data. This action cannot be undone.
                  </p>
                  {itemType === 'list' && (
                    <p className="text-sm text-muted-foreground mt-2">
                      All tasks, columns, and related data in this list will be permanently deleted.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Delete {itemTypeLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

