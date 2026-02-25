// Types based on backend entities - ensuring type safety

export type IconType =
  | "solid"
  | "outline"
  export type ItemType =
  | "list"
  | "doc"
  | "whiteboard"

// Backend response types (as received from API)
export interface BackendCollection {
  id: string;
  workspaceId: string;
  name: string;
  description?: string | null;
  iconType: IconType | null;
  icon: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
  folders?: BackendFolder[];
  items?: BackendItem[];
}

export interface BackendFolder {
  id: string;
  collectionId: string | null;
  parentFolderId: string | null;
  name: string;
  description?: string | null;
  iconType: IconType | null;
  icon: string | null;
  iconColor: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
  childFolders?: BackendFolder[];
  items?: BackendItem[];
}

export interface BackendItem {
  id: string;
  collectionId: string | null;
  parentFolderId: string | null;
  name: string;
  type: ItemType;
  iconType: IconType | null;
  icon: string | null;
  iconColor: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
}

// Frontend hierarchy types (transformed structure)
export interface PlaygroundItem {
  id: string;
  collectionId: string | null;
  parentFolderId: string | null;
  name: string;
  type: ItemType;
  iconType: IconType | null;
  icon: string | null;
  iconColor: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlaygroundFolder {
  id: string;
  collectionId: string | null;
  parentFolderId: string | null;
  name: string;
  iconType: IconType | null;
  icon: string | null;
  iconColor: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
  childFolders: PlaygroundFolder[];
  items: PlaygroundItem[];
}

export interface PlaygroundCollection {
  id: string;
  workspaceId: string;
  name: string;
  description?: string | null;
  iconType: IconType | null;
  icon: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
  folders: PlaygroundFolder[];
  items: PlaygroundItem[];
}

export type PlaygroundCollectionsResponse = PlaygroundCollection[];

