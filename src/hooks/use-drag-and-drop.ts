import { useState, useRef, useCallback } from 'react';

export interface DragItem {
  id: string;
  columnId: string;
  index: number;
}

export interface DragState {
  isDragging: boolean;
  draggedItem: DragItem | null;
  dragOverColumn: string | null;
  dragOverIndex: number | null;
}

export const useDragAndDrop = () => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedItem: null,
    dragOverColumn: null,
    dragOverIndex: null,
  });

  const dragStartPos = useRef({ x: 0, y: 0 });
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleDragStart = useCallback((item: DragItem, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    dragStartPos.current = { x: event.clientX, y: event.clientY };
    dragOffset.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    setDragState({
      isDragging: true,
      draggedItem: item,
      dragOverColumn: null,
      dragOverIndex: null,
    });

    // Prevent text selection during drag
    document.body.style.userSelect = 'none';
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedItem: null,
      dragOverColumn: null,
      dragOverIndex: null,
    });

    // Restore text selection
    document.body.style.userSelect = '';
  }, []);

  const handleDragOver = useCallback((columnId: string, index?: number) => {
    setDragState(prev => ({
      ...prev,
      dragOverColumn: columnId,
      dragOverIndex: index ?? null,
    }));
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragState(prev => ({
      ...prev,
      dragOverColumn: null,
      dragOverIndex: null,
    }));
  }, []);

  const getDragPreviewStyle = (event: React.MouseEvent): React.CSSProperties => {
    return {
      position: 'fixed',
      left: event.clientX - dragOffset.current.x,
      top: event.clientY - dragOffset.current.y,
      pointerEvents: 'none',
      zIndex: 1000,
      transform: 'rotate(5deg)',
      opacity: 0.8,
    };
  };

  const shouldShowDropIndicator = (columnId: string, index: number): boolean => {
    if (!dragState.isDragging) return false;
    
    // For empty columns, show indicator at index 0
    if (dragState.dragOverColumn === columnId) {
      if (dragState.dragOverIndex === index) {
        // Don't show indicator if dragging within the same position
        const isSamePosition = 
          dragState.draggedItem?.columnId === columnId &&
          (dragState.draggedItem.index === index || dragState.draggedItem.index === index - 1);
        
        return !isSamePosition;
      }
    }
    
    return false;
  };

  return {
    dragState,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    getDragPreviewStyle,
    shouldShowDropIndicator,
  };
};