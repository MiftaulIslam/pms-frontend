import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCollection, deleteFolder, deleteItem } from '../api/playground-api-service';
import { useNotifications } from '@/hooks/use-notifications';

/**
 * Hook for deleting collections, folders, and items
 * Handles API mutations, query invalidation, and notifications
 */
export function useDeleteEntity() {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  // Delete collection mutation
  const deleteCollectionMutation = useMutation({
    mutationFn: async (collectionId: string) => {
      return deleteCollection(collectionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      addNotification({
        type: 'success',
        title: 'Collection deleted',
        message: 'Collection has been deleted successfully',
      });
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to delete collection',
        message: error.message || 'An error occurred',
      });
      throw error;
    },
  });

  // Delete folder mutation
  const deleteFolderMutation = useMutation({
    mutationFn: async (folderId: string) => {
      return deleteFolder(folderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      addNotification({
        type: 'success',
        title: 'Folder deleted',
        message: 'Folder has been deleted successfully',
      });
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to delete folder',
        message: error.message || 'An error occurred',
      });
      throw error;
    },
  });

  // Delete item mutation
  const deleteItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      return deleteItem(itemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      addNotification({
        type: 'success',
        title: 'Item deleted',
        message: 'Item has been deleted successfully',
      });
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to delete item',
        message: error.message || 'An error occurred',
      });
      throw error;
    },
  });

  return {
    deleteCollection: deleteCollectionMutation.mutateAsync,
    deleteCollectionLoading: deleteCollectionMutation.isPending,
    deleteFolder: deleteFolderMutation.mutateAsync,
    deleteFolderLoading: deleteFolderMutation.isPending,
    deleteItem: deleteItemMutation.mutateAsync,
    deleteItemLoading: deleteItemMutation.isPending,
  };
}

