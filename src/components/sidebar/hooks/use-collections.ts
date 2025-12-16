import { useQuery } from '@tanstack/react-query';
import { getCollections } from '../api/playground-api-service';
import { usePlayground } from '../contexts/playground-context/use-playground';
import { useWorkspace } from '../contexts/workspace-context/use-workspace';
import { useEffect } from 'react';

/**
 * Custom hook for fetching and managing collections
 * Integrates TanStack Query with Playground context
 */
export function useCollections() {
  const { currentWorkspaceId } = useWorkspace();
  const { setCollections } = usePlayground();

  const {
    data: collections,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['collections', currentWorkspaceId],
    queryFn: () => {
      if (!currentWorkspaceId) {
        throw new Error('Workspace ID is required');
      }
      return getCollections(currentWorkspaceId);
    },
    enabled: !!currentWorkspaceId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    // React Query v4 uses 'select' or 'onSuccess' but type errors show your options don't accept 'onSuccess'.
    // So, update with 'onSuccess' via separate useEffect to be type-safe.
  });
  // Update context when data is fetched, in sync with 'collections'
  useEffect(() => {
    if (collections) {
      setCollections(collections);
    }
  }, [collections, setCollections]);

  return {
    collections: collections || [],
    isLoading,
    isError,
    error,
    refetch,
  };
}

