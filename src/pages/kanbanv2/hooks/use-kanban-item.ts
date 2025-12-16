import { useParams } from 'react-router-dom';

/**
 * Hook to get itemId from URL params
 * Supports /dashboard/list/:id route
 */
export function useKanbanItemId(): string | null {
  const params = useParams<{ id: string }>();
  
  // Check if we're on /dashboard/list/:id route
  if (params.id) {
    return params.id;
  }
  
  // For now, return null if no id in params
  // This can be extended to get from other sources if needed
  return null;
}

