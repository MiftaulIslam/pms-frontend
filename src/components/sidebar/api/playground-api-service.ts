import { apiClient } from '@/lib/api/axios-instance';
import type {
  BackendCollection,
  BackendFolder,
  PlaygroundCollection,
  PlaygroundFolder,
  PlaygroundCollectionsResponse,
  IconType,
} from '../types/playground-types';
import { COLLECTION_APIS } from './playground-api';

/**
 * Transforms backend folder structure to frontend hierarchy
 * Creates a folder object with empty childFolders and items arrays
 */
function createFolderObject(backendFolder: BackendFolder): PlaygroundFolder {
  return {
    id: backendFolder.id,
    collectionId: backendFolder.collectionId,
    parentFolderId: backendFolder.parentFolderId,
    name: backendFolder.name,
    iconType: backendFolder.iconType,
    icon: backendFolder.icon,
    iconColor: backendFolder.iconColor,
    position: backendFolder.position,
    createdAt: backendFolder.createdAt,
    updatedAt: backendFolder.updatedAt,
    childFolders: [],
    items: [],
  };
}

/**
 * Transforms backend collection response to frontend hierarchy structure
 * Organizes folders hierarchically from flat list based on parentFolderId
 * Handles nested folders recursively and ensures proper structure
 */
function transformCollection(backendCollection: BackendCollection): PlaygroundCollection {
  // Create a map of all folders for quick lookup
  const folderMap = new Map<string, PlaygroundFolder>();
  const rootFolders: PlaygroundFolder[] = [];

  // First pass: create folder objects (without hierarchy)
  (backendCollection.folders || []).forEach((folder) => {
    folderMap.set(folder.id, createFolderObject(folder));
  });

  // Second pass: organize hierarchy
  (backendCollection.folders || []).forEach((folder) => {
    const transformedFolder = folderMap.get(folder.id);
    if (!transformedFolder) return;

    // Organize hierarchy based on parentFolderId
    if (folder.parentFolderId) {
      const parent = folderMap.get(folder.parentFolderId);
      if (parent) {
        parent.childFolders.push(transformedFolder);
      } else {
        // Parent not found, treat as root folder (data inconsistency handling)
        rootFolders.push(transformedFolder);
      }
    } else {
      // Root folder (no parent)
      rootFolders.push(transformedFolder);
    }
  });

  // Third pass: assign items to folders based on parentFolderId
  // Items that belong directly to collection (parentFolderId is null) stay in collection.items
  // Items that belong to folders are assigned to those folders
  const allItems = backendCollection.items || [];
  allItems.forEach((item) => {
    if (item.parentFolderId) {
      const folder = folderMap.get(item.parentFolderId);
      if (folder) {
        folder.items.push(item);
      }
    }
    // Items without parentFolderId stay in collection.items (handled below)
  });

  // Sort folders and items by position
  const sortByPosition = <T extends { position: number }>(items: T[]): T[] => {
    return [...items].sort((a, b) => a.position - b.position);
  };

  const sortFoldersRecursively = (folders: PlaygroundFolder[]): PlaygroundFolder[] => {
    return sortByPosition(folders).map((folder) => ({
      ...folder,
      childFolders: sortFoldersRecursively(folder.childFolders),
      items: sortByPosition(folder.items),
    }));
  };

  // Filter items: only keep items that belong directly to collection (no parentFolderId)
  const collectionItems = allItems.filter((item) => !item.parentFolderId);

  return {
    id: backendCollection.id,
    workspaceId: backendCollection.workspaceId,
    name: backendCollection.name,
    description: backendCollection.description,
    iconType: backendCollection.iconType,
    icon: backendCollection.icon,
    position: backendCollection.position,
    createdAt: backendCollection.createdAt,
    updatedAt: backendCollection.updatedAt,
    folders: sortFoldersRecursively(rootFolders),
    items: sortByPosition(collectionItems),
  };
}

/**
 * Fetches all collections for a workspace with their full hierarchy
 * Transforms backend response to frontend structure
 */
export async function getCollections(
  workspaceId: string
): Promise<PlaygroundCollectionsResponse> {
  const response = await apiClient.get<BackendCollection[]>(
    COLLECTION_APIS({ workspaceId }).GET_COLLECTIONS
  );

  // Transform each collection to frontend structure
  return response.data.map(transformCollection);
}

/**
 * Creates a new collection
 * @param data Collection creation data
 * @returns Created collection
 */
export async function createCollection(data: {
  workspaceId: string;
  name: string;
  description?: string | null;
  iconType?: IconType | null;
  icon?: string | null;
}): Promise<BackendCollection> {
  const response = await apiClient.post<BackendCollection>(
    COLLECTION_APIS({}).CREATE_COLLECTION,
    data
  );
  return response.data;
}

/**
 * Creates a new folder
 * @param data Folder creation data
 * @returns Created folder
 */
export async function createFolder(data: {
  collectionId?: string | null;
  parentFolderId?: string | null;
  name: string;
  description?: string | null;
}): Promise<BackendFolder> {
  const response = await apiClient.post<BackendFolder>(
    COLLECTION_APIS({}).CREATE_FOLDER,
    data
  );
  return response.data;
}

/**
 * Creates a new item (list/doc/whiteboard)
 * @param data Item creation data
 * @returns Created item
 */
export async function createItem(data: {
  collectionId: string;
  parentFolderId?: string | null;
  name: string;
  description?: string;
  type: 'list' | 'doc' | 'whiteboard';
  columns?: Array<{ title: string; position: number; color?: string | null }>;
}): Promise<any> {
  const response = await apiClient.post<any>(
    COLLECTION_APIS({}).CREATE_ITEM,
    data
  );
  return response.data;
}

/**
 * Creates a kanban column
 * @param data Column creation data
 * @returns Created column
 */
export async function createKanbanColumn(data: {
  kanbanBoardId: string;
  title: string;
  color?: string | null;
}): Promise<any> {
  const response = await apiClient.post<any>(
    COLLECTION_APIS({}).CREATE_KANBAN_COLUMN,
    data
  );
  return response.data;
}

/**
 * Gets kanban board by itemId
 * @param itemId Item ID
 * @returns Kanban board with columns (raw backend response)
 */
export async function getKanbanBoardRaw(itemId: string): Promise<{
  id: string;
  itemId: string;
  columns: Array<{
    id: string;
    kanbanBoardId: string;
    title: string;
    position: number;
    color: string | null;
  }>;
}> {
  const response = await apiClient.get<any>(
    COLLECTION_APIS({ itemId }).GET_KANBAN_BOARD
  );
  return response.data;
}

/**
 * Reorders a kanban column
 * @param columnId Column ID
 * @param position New position
 * @returns Updated column
 */
export async function reorderKanbanColumn(columnId: string, position: number): Promise<any> {
  const response = await apiClient.patch<any>(
    COLLECTION_APIS({ itemId: columnId }).REORDER_KANBAN_COLUMN,
    { position }
  );
  return response.data;
}

/**
 * Deletes a collection
 * @param collectionId Collection ID
 */
export async function deleteCollection(collectionId: string): Promise<void> {
  await apiClient.delete(COLLECTION_APIS({ collectionId }).DELETE_COLLECTION);
}

/**
 * Deletes a folder
 * @param folderId Folder ID
 */
export async function deleteFolder(folderId: string): Promise<void> {
  await apiClient.delete(COLLECTION_APIS({ folderId }).DELETE_FOLDER);
}

/**
 * Deletes an item
 * @param itemId Item ID
 */
export async function deleteItem(itemId: string): Promise<void> {
  await apiClient.delete(COLLECTION_APIS({ itemId }).DELETE_ITEM);
}

/**
 * Updates a collection's icon and color
 * @param collectionId Collection ID
 * @param data Update data
 * @returns Updated collection
 */
export async function updateCollectionIconColor(
  collectionId: string,
  data: {
    iconType?: IconType;
    icon?: string;
    iconColor?: string;
  }
): Promise<BackendCollection> {
  const response = await apiClient.patch<BackendCollection>(
    COLLECTION_APIS({ collectionId }).UPDATE_COLLECTION,
    data
  );
  return response.data;
}

/**
 * Updates a folder's icon and color
 * @param folderId Folder ID
 * @param data Update data
 * @returns Updated folder
 */
export async function updateFolderIconColor(
  folderId: string,
  data: {
    iconType?: IconType;
    icon?: string;
    iconColor?: string;
  }
): Promise<BackendFolder> {
  const response = await apiClient.patch<BackendFolder>(
    COLLECTION_APIS({ folderId }).UPDATE_FOLDER,
    data
  );
  return response.data;
}

/**
 * Updates an item's icon and color
 * @param itemId Item ID
 * @param data Update data
 * @returns Updated item
 */
export async function updateItemIconColor(
  itemId: string,
  data: {
    iconType?: IconType;
    icon?: string;
    iconColor?: string;
  }
): Promise<any> {
  const response = await apiClient.patch<any>(
    COLLECTION_APIS({ itemId }).UPDATE_ITEM,
    data
  );
  return response.data;
}

/**
 * Duplicates a collection
 * @param collectionId Collection ID
 * @returns Duplicated collection
 */
export async function duplicateCollection(collectionId: string): Promise<BackendCollection> {
  const response = await apiClient.post<BackendCollection>(
    COLLECTION_APIS({ collectionId }).DUPLICATE_COLLECTION
  );
  return response.data;
}

/**
 * Duplicates a folder
 * @param folderId Folder ID
 * @returns Duplicated folder
 */
export async function duplicateFolder(folderId: string): Promise<BackendFolder> {
  const response = await apiClient.post<BackendFolder>(
    COLLECTION_APIS({ folderId }).DUPLICATE_FOLDER
  );
  return response.data;
}

/**
 * Duplicates an item
 * @param itemId Item ID
 * @returns Duplicated item
 */
export async function duplicateItem(itemId: string): Promise<any> {
  const response = await apiClient.post<any>(
    COLLECTION_APIS({ itemId }).DUPLICATE_ITEM
  );
  return response.data;
}

