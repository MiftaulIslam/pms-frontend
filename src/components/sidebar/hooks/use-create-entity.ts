import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createFolder, createItem } from '../api/playground-api-service';
import { useNotifications } from '@/hooks/use-notifications';

/**
 * Extract collection ID from URL like "#collection-{id}"
 */
export function extractCollectionId(url: string): string | null {
    const match = url.match(/#collection-(.+)/);
    return match ? match[1] : null;
}

/**
 * Extract folder ID from URL like "#folder-{id}"
 */
export function extractFolderId(url: string): string | null {
    const match = url.match(/#folder-(.+)/);
    return match ? match[1] : null;
}

/**
 * Hook for creating folders and lists
 * Handles API mutations, query invalidation, and navigation
 */
export function useCreateEntity() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  // Folder creation mutation
  const createFolderMutation = useMutation({
    mutationFn: async (data: {
      collectionId?: string | null;
      parentFolderId?: string | null;
      name: string;
      description?: string;
    }) => {
      return createFolder(data);
    },
    onSuccess: () => {
      // Invalidate collections query to refetch
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      addNotification({
        type: 'success',
        title: 'Folder created',
        message: 'Folder has been created successfully',
      });
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to create folder',
        message: error.message || 'An error occurred',
      });
      throw error;
    },
  });

  // List creation mutation
  const createListMutation = useMutation({
    mutationFn: async (data: {
      collectionId: string;
      parentFolderId?: string | null;
      name: string;
      description?: string;
      columns: Array<{ title: string; position: number; color?: string | null }>;
    }) => {
      return createItem({
        collectionId: data.collectionId,
        parentFolderId: data.parentFolderId,
        name: data.name,
        description: data.description,
        type: 'list',
        columns: data.columns.length > 0 ? data.columns : undefined,
      });
    },
    onSuccess: async (item) => {
      // Invalidate queries to refetch collections
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      
      // Navigate to the list
      if (item.id) {
        navigate(`/dashboard/list/${item.id}`);
      }
      
      addNotification({
        type: 'success',
        title: 'List created',
        message: 'List has been created successfully',
      });
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to create list',
        message: error.message || 'An error occurred',
      });
      throw error;
    },
  });

  return {
    createFolder: createFolderMutation.mutateAsync,
    createFolderLoading: createFolderMutation.isPending,
    createList: createListMutation.mutateAsync,
    createListLoading: createListMutation.isPending,
  };
}
