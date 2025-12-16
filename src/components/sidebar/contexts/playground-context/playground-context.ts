import * as React from 'react';
import type {
  PlaygroundCollection,
  PlaygroundFolder,
  PlaygroundItem,
} from '../../types/playground-types';

export interface PlaygroundContextType {
  // Collections state
  collections: PlaygroundCollection[];
  setCollections: (collections: PlaygroundCollection[]) => void;

  // Currently opened collection
  openedCollectionId: string | null;
  setOpenedCollectionId: (id: string | null) => void;
  openedCollection: PlaygroundCollection | null;

  // Currently opened folder
  openedFolderId: string | null;
  setOpenedFolderId: (id: string | null) => void;
  openedFolder: PlaygroundFolder | null;

  // Helper methods
  getCollectionById: (id: string) => PlaygroundCollection | undefined;
  getFolderById: (folderId: string, collectionId?: string) => PlaygroundFolder | null;
  getItemById: (itemId: string, collectionId?: string, folderId?: string) => PlaygroundItem | null;
}

export const PlaygroundContext = React.createContext<PlaygroundContextType | undefined>(
  undefined
);

