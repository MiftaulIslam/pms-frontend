import { useMutation, useQueryClient } from '@tanstack/react-query';
import { duplicateCollection, duplicateFolder, duplicateItem } from '../api/playground-api-service';
import { useNotifications } from '@/hooks/use-notifications';

/**
 * Hook for duplicating collections, folders, and items
 * Handles API mutations, query invalidation, and notifications
 */
export function useDuplicateEntity() {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  // Collection duplication mutation
  const duplicateCollectionMutation = useMutation({
    mutationFn: async (collectionId: string) => {
      return duplicateCollection(collectionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      addNotification({
        type: 'success',
        title: 'Collection duplicated',
        message: 'Collection has been duplicated successfully',
      });
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to duplicate collection',
        message: error.message || 'An error occurred',
      });
      throw error;
    },
  });

  // Folder duplication mutation
  const duplicateFolderMutation = useMutation({
    mutationFn: async (folderId: string) => {
      return duplicateFolder(folderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      addNotification({
        type: 'success',
        title: 'Folder duplicated',
        message: 'Folder has been duplicated successfully',
      });
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to duplicate folder',
        message: error.message || 'An error occurred',
      });
      throw error;
    },
  });

  // Item duplication mutation
  const duplicateItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      return duplicateItem(itemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      addNotification({
        type: 'success',
        title: 'Item duplicated',
        message: 'Item has been duplicated successfully',
      });
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to duplicate item',
        message: error.message || 'An error occurred',
      });
      throw error;
    },
  });

  return {
    duplicateCollection: duplicateCollectionMutation.mutateAsync,
    duplicateCollectionLoading: duplicateCollectionMutation.isPending,
    duplicateFolder: duplicateFolderMutation.mutateAsync,
    duplicateFolderLoading: duplicateFolderMutation.isPending,
    duplicateItem: duplicateItemMutation.mutateAsync,
    duplicateItemLoading: duplicateItemMutation.isPending,
  };
}


