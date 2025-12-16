import * as React from 'react';
import { PlaygroundContext, type PlaygroundContextType } from './playground-context';
import type {
  PlaygroundCollection,
  PlaygroundFolder,
  PlaygroundItem,
} from '../../types/playground-types';

interface PlaygroundProviderProps {
  children: React.ReactNode;
}

/**
 * PlaygroundProvider manages the state for collections, folders, and items
 * Provides helper methods to access nested data structures
 */
export function PlaygroundProvider({ children }: PlaygroundProviderProps) {
  const [collections, setCollections] = React.useState<PlaygroundCollection[]>([]);
  const [openedCollectionId, setOpenedCollectionId] = React.useState<string | null>(null);
  const [openedFolderId, setOpenedFolderId] = React.useState<string | null>(null);

  // Get currently opened collection
  const openedCollection = React.useMemo(() => {
    if (!openedCollectionId) return null;
    return collections.find((c) => c.id === openedCollectionId) || null;
  }, [collections, openedCollectionId]);

  // Get currently opened folder
  const openedFolder = React.useMemo(() => {
    if (!openedFolderId) return null;

    // Search in opened collection first
    if (openedCollection) {
      const findFolderRecursively = (
        folders: PlaygroundFolder[],
        targetId: string
      ): PlaygroundFolder | null => {
        for (const folder of folders) {
          if (folder.id === targetId) return folder;
          const found = findFolderRecursively(folder.childFolders, targetId);
          if (found) return found;
        }
        return null;
      };

      return findFolderRecursively(openedCollection.folders, openedFolderId);
    }

    // Search in all collections if no opened collection
    for (const collection of collections) {
      const findFolderRecursively = (
        folders: PlaygroundFolder[],
        targetId: string
      ): PlaygroundFolder | null => {
        for (const folder of folders) {
          if (folder.id === targetId) return folder;
          const found = findFolderRecursively(folder.childFolders, targetId);
          if (found) return found;
        }
        return null;
      };

      const found = findFolderRecursively(collection.folders, openedFolderId);
      if (found) return found;
    }

    return null;
  }, [collections, openedCollection, openedFolderId]);

  // Helper: Get collection by ID
  const getCollectionById = React.useCallback(
    (id: string): PlaygroundCollection | undefined => {
      return collections.find((c) => c.id === id);
    },
    [collections]
  );

  // Helper: Get folder by ID (searches recursively)
  const getFolderById = React.useCallback(
    (folderId: string, collectionId?: string): PlaygroundFolder | null => {
      const collectionsToSearch = collectionId
        ? collections.filter((c) => c.id === collectionId)
        : collections;

      const findFolderRecursively = (
        folders: PlaygroundFolder[],
        targetId: string
      ): PlaygroundFolder | null => {
        for (const folder of folders) {
          if (folder.id === targetId) return folder;
          const found = findFolderRecursively(folder.childFolders, targetId);
          if (found) return found;
        }
        return null;
      };

      for (const collection of collectionsToSearch) {
        const found = findFolderRecursively(collection.folders, folderId);
        if (found) return found;
      }

      return null;
    },
    [collections]
  );

  // Helper: Get item by ID (searches in collections and folders)
  const getItemById = React.useCallback(
    (
      itemId: string,
      collectionId?: string,
      folderId?: string
    ): PlaygroundItem | null => {
      const collectionsToSearch = collectionId
        ? collections.filter((c) => c.id === collectionId)
        : collections;

      for (const collection of collectionsToSearch) {
        // Search in collection's direct items
        const directItem = collection.items.find((item) => item.id === itemId);
        if (directItem) return directItem;

        // Search in folders
        const findItemInFolders = (folders: PlaygroundFolder[]): PlaygroundItem | null => {
          for (const folder of folders) {
            // Skip if folderId is specified and doesn't match
            if (folderId && folder.id !== folderId) {
              const found = findItemInFolders(folder.childFolders);
              if (found) return found;
              continue;
            }

            const item = folder.items.find((i) => i.id === itemId);
            if (item) return item;

            const found = findItemInFolders(folder.childFolders);
            if (found) return found;
          }
          return null;
        };

        const found = findItemInFolders(collection.folders);
        if (found) return found;
      }

      return null;
    },
    [collections]
  );

  const value: PlaygroundContextType = React.useMemo(
    () => ({
      collections,
      setCollections,
      openedCollectionId,
      setOpenedCollectionId,
      openedCollection,
      openedFolderId,
      setOpenedFolderId,
      openedFolder,
      getCollectionById,
      getFolderById,
      getItemById,
    }),
    [
      collections,
      openedCollectionId,
      openedCollection,
      openedFolderId,
      openedFolder,
      getCollectionById,
      getFolderById,
      getItemById,
    ]
  );

  return (
    <PlaygroundContext.Provider value={value}>{children}</PlaygroundContext.Provider>
  );
}

