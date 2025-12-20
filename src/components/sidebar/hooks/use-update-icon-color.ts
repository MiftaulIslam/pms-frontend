import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCollectionIconColor, updateFolderIconColor, updateItemIconColor } from '../api/playground-api-service';
import { useNotifications } from '@/hooks/use-notifications';
import type { IconType } from '../types/playground-types';

export function useUpdateIconColor() {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  const updateCollection = useMutation({
    mutationFn: async ({
      collectionId,
      iconType,
      icon,
      iconColor,
    }: {
      collectionId: string;
      iconType?: IconType;
      icon?: string;
      iconColor?: string;
    }) => {
      return updateCollectionIconColor(collectionId, { iconType, icon, iconColor });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to update icon/color',
        message: error.message || 'An error occurred',
      });
    },
  });

  const updateFolder = useMutation({
    mutationFn: async ({
      folderId,
      iconType,
      icon,
      iconColor,
    }: {
      folderId: string;
      iconType?: IconType;
      icon?: string;
      iconColor?: string;
    }) => {
      return updateFolderIconColor(folderId, { iconType, icon, iconColor });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to update icon/color',
        message: error.message || 'An error occurred',
      });
    },
  });

  const updateItem = useMutation({
    mutationFn: async ({
      itemId,
      iconType,
      icon,
      iconColor,
    }: {
      itemId: string;
      iconType?: IconType;
      icon?: string;
      iconColor?: string;
    }) => {
      return updateItemIconColor(itemId, { iconType, icon, iconColor });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to update icon/color',
        message: error.message || 'An error occurred',
      });
    },
  });

  return {
    updateCollection: updateCollection.mutateAsync,
    updateFolder: updateFolder.mutateAsync,
    updateItem: updateItem.mutateAsync,
  };
}



