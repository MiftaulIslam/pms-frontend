import { ChevronRight, ClipboardList, Database, File, FileText, Folder, MoreHorizontal, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { SidebarMenuAction, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar } from "../ui/sidebar";
import { DropdownMenu, DropdownMenuSeparator, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { FolderModal } from "./components/folder-modal";
import { ListModal } from "./components/list-modal";
import { DeleteCollectionDialog, DeleteFolderDialog, DeleteItemDialog } from "./components/delete-confirmation";
import { useCreateEntity, extractCollectionId, extractFolderId } from "./hooks/use-create-entity";
import { useDeleteEntity } from "./hooks/use-delete-entity";
import { ItemContextMenu } from "./components/item-context-menu";
import type { IconType } from "./types/playground-types";
import { cn } from "@/lib/utils";
import { getIcon, type IconComponent, type IconName } from "@/icons";
import { TruncatedText } from "../common/truncated-text";
import { useNotifications } from "@/hooks/use-notifications";
export type NavItem = {
  title: string
  url: string
  itemId?: string
  itemType?: 'list' | 'doc' | 'whiteboard'
  items?: NavItem[]
  icon?: string
  iconColor?: string
  iconType?: IconType
  collectionId?: string  // Added to track collection ID for folders
}

export function NestedMenuItems({ items, level = 0 }: { items: NavItem[]; level?: number }) {

  console.log("items", items)
  const { isMobile } = useSidebar();
  const { createFolder, createFolderLoading, createList, createListLoading } = useCreateEntity();
  const { deleteCollection, deleteCollectionLoading, deleteFolder, deleteFolderLoading, deleteItem, deleteItemLoading } = useDeleteEntity();
  const { addNotification } = useNotifications();

  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [listModalOpen, setListModalOpen] = useState(false);
  const [currentParent, setCurrentParent] = useState<{ collectionId?: string | null; folderId?: string | null } | null>(null);

  // Delete state
  const [deleteCollectionOpen, setDeleteCollectionOpen] = useState(false);
  const [deleteFolderOpen, setDeleteFolderOpen] = useState(false);
  const [deleteItemOpen, setDeleteItemOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string; type?: 'list' | 'doc' | 'whiteboard' } | null>(null);

  // Helper function to determine item type from URL or itemType property
  const getItemType = (item: NavItem): 'collection' | 'folder' | 'item' => {
    // If item has itemType property, it's an item (list, doc, whiteboard, etc.)
    if (item.itemType) {
      return 'item'
    }
    if (item.url.startsWith('#collection-')) {
      return 'collection'
    }
    if (item.url.startsWith('#folder-')) {
      return 'folder'
    }
    return 'item'
  }

  const handleFolderClick = (item: NavItem) => {
    const collectionId = extractCollectionId(item.url);
    const folderId = extractFolderId(item.url);
    setCurrentParent({ collectionId, folderId });
    setFolderModalOpen(true);
  };

  const handleListClick = (item: NavItem) => {
    const collectionId = extractCollectionId(item.url) || item.collectionId;
    const folderId = extractFolderId(item.url);
    if (!collectionId) {
      // Need collection ID for list creation
      console.error('Collection ID is required for list creation');
      return;
    }
    setCurrentParent({ collectionId, folderId });
    setListModalOpen(true);
  };

  const handleFolderSubmit = async (data: { name: string; description?: string }) => {
    if (!currentParent) return;
    await createFolder({
      collectionId: currentParent.collectionId || null,
      parentFolderId: currentParent.folderId || null,
      name: data.name,
      description: data.description,
    });
  };

  const handleListSubmit = async (data: { name: string; description?: string; columns: Array<{ title: string; position: number; color?: string | null }> }) => {
    if (!currentParent?.collectionId) return;
    await createList({
      collectionId: currentParent.collectionId,
      parentFolderId: currentParent.folderId || null,
      name: data.name,
      description: data.description,
      columns: data.columns,
    });
  };

  const handleDeleteClick = (item: NavItem) => {
    const itemType = getItemType(item);
    let id: string | null = null;

    if (itemType === 'collection') {
      id = extractCollectionId(item.url);
      if (id) {
        setDeleteTarget({ id, name: item.title });
        setDeleteCollectionOpen(true);
      }
    } else if (itemType === 'folder') {
      id = extractFolderId(item.url);
      if (id) {
        setDeleteTarget({ id, name: item.title });
        setDeleteFolderOpen(true);
      }
    } else {
      // Item
      id = item.itemId || null;
      if (id) {
        setDeleteTarget({ id, name: item.title, type: item.itemType });
        setDeleteItemOpen(true);
      }
    }
  };

  const handleDeleteCollection = async () => {
    if (!deleteTarget) return;
    await deleteCollection(deleteTarget.id);
    setDeleteCollectionOpen(false);
    setDeleteTarget(null);
  };

  const handleDeleteFolder = async () => {
    if (!deleteTarget) return;
    await deleteFolder(deleteTarget.id);
    setDeleteFolderOpen(false);
    setDeleteTarget(null);
  };

  const handleDeleteItem = async () => {
    if (!deleteTarget) return;
    await deleteItem(deleteTarget.id);
    setDeleteItemOpen(false);
    setDeleteTarget(null);
  };
  return (
    <>
      {items.map((item) => {
        // Create a unique key for each item to ensure independent state
        const itemKey = `${item.title}-${item.url}-${level}`
        const IconComp = getIcon(item.iconType as IconType, item.icon as IconName) as IconComponent;
        return (
          <Collapsible
            key={itemKey}
            asChild
            defaultOpen={false}
            className="group/collapsible-sub"
          >
            <SidebarMenuSubItem>
              {item.items && item.items.length > 0 ? (
                <>
                  <CollapsibleTrigger asChild className="p-2!">
                    <SidebarMenuSubButton
                      className="group/menu-sub-item "
                    >
                      {/* ICON */}
                      <span className="relative flex h-4 w-4 items-center justify-center">
                        {item.icon && (
                          <span 
                          className={cn(
                            'w-6 h-6 rounded-full flex items-center justify-center'
                          )}
                          style={{ backgroundColor: item.iconColor }}>
                            <IconComp color={"white"} className={` size-4 transition-opacity group-hover/menu-sub-item:${item.items && item.items.length > 0 ? 'opacity-0' : 'opacity-100'} `}/>
                          </span>
                        )}

                        {item.items && item.items.length > 0 && (
                          <ChevronRight
                            className=" size-4 absolute opacity-0 transition-all duration-200  group-hover/menu-sub-item:opacity-100  group-data-[state=open]/collapsible-sub:rotate-90"
                          />
                        )}
                      </span>

                      {/* TITLE */}
                      <TruncatedText 
                        text={item.title}
                        maxWidth="130px"
                      />

                    </SidebarMenuSubButton>
                    

                  </CollapsibleTrigger>
                  <div className="ml-auto flex items-center gap-1">
                    {getItemType(item) !== 'item' && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuAction className="right-[7px]">
                            <Plus />
                          </SidebarMenuAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          className="rounded-lg"
                          side={isMobile ? "bottom" : "right"}
                          // align={isMobile ? "end" : "start"}
                        >
                          {getItemType(item) === 'collection' && (
                            <DropdownMenuItem onClick={() => handleFolderClick(item)}>
                              <div className="flex items-start gap-2 cursor-pointer">
                                <Folder className="text-muted-foreground" />
                                <p>
                                  <span className="text-sm font-medium block">Folder</span>
                                  <span className="text-xs text-muted-foreground">
                                    Create a new folder to organize your projects
                                  </span>
                                </p>
                              </div>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleListClick(item)}>
                            <div className="flex items-start gap-2 cursor-pointer">
                              <ClipboardList className="text-muted-foreground" />
                              <p>
                                <span className="text-sm font-medium block">List</span>
                                <span className="text-xs text-muted-foreground">
                                  Track tasks, ideas, and more
                                </span>
                              </p>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <div className="flex items-start gap-2 cursor-pointer">
                              <FileText className="text-muted-foreground" />
                              <p>
                                <span className="text-sm font-medium block">Whiteboard</span>
                                <span className="text-xs text-muted-foreground">
                                  Collaborate with your team on ideas and plans
                                </span>
                              </p>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <div className="flex items-start gap-2 cursor-pointer">
                              <File className="text-muted-foreground" />
                              <p>
                                <span className="text-sm font-medium block">Doc</span>
                                <span className="text-xs text-muted-foreground">
                                  Share files, images, and more
                                </span>
                              </p>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <div className="flex items-start gap-2 cursor-pointer">
                              <Database className="text-muted-foreground" />
                              <p>
                                <span className="text-sm font-medium block">ERD</span>
                                <span className="text-xs text-muted-foreground">
                                  Visualize your database schema
                                </span>
                              </p>
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction className="right-[2.2rem]">
                          <MoreHorizontal />
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-64 rounded-lg p-2 space-y-1"
                        side={isMobile ? "bottom" : "right"}
                      >
                        <ItemContextMenu
                          kind={getItemType(item)}
                          title={item.title}
                          itemId={
                            getItemType(item) === 'collection'
                              ? extractCollectionId(item.url) || undefined
                              : getItemType(item) === 'folder'
                              ? extractFolderId(item.url) || undefined
                              : item.itemId
                          }
                          currentIconType={item.iconType}
                          currentIcon={item.icon}
                          currentColor={item.iconColor}
                          onCreateFolder={getItemType(item) === 'collection' ? () => handleFolderClick(item) : undefined}
                          onCreateList={getItemType(item) !== 'item' ? () => handleListClick(item) : undefined}
                          onCreateDoc={() => console.log('Create Doc for', item.title)}
                          onCreateWhiteboard={() => console.log('Create Whiteboard for', item.title)}
                          onCreateErd={() => console.log('Create ERD for', item.title)}
                          onMove={() => console.log('Move', item.title)}
                          onDelete={() => handleDeleteClick(item)}
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CollapsibleContent >
                    <SidebarMenuSub className="m-0 p-0">
                      <NestedMenuItems items={item.items} level={level + 1} />
                    </SidebarMenuSub>
                  </CollapsibleContent>

                </>
              ) : (
                <>
                  <SidebarMenuSubButton asChild>
                    {item.itemType === 'list' && item.itemId ? (
                      <Link to={`list/${item.itemId}`}>
                            {item.icon && <span 
                            className={cn(
                              'w-6 h-6 rounded-full flex items-center justify-center'
                            )}
                            style={{ backgroundColor: item.iconColor }}>
                              <IconComp color={"white"} className={` size-4 transition-opacity group-hover/menu-sub-item:${item.items && item.items.length > 0 ? 'opacity-0' : 'opacity-100'} `}/>
                            </span>}
                            <TruncatedText 
                              text={item.title}
                              maxWidth="130px"
                            />
                      </Link>
                    ) : (
                      <a href={item.url}>
                            {item.icon && <span 
                            className={cn(
                              'w-6 h-6 rounded-full flex items-center justify-center'
                            )}
                            style={{ backgroundColor: item.iconColor }}>
                              <IconComp color={"white"} className={` size-4 transition-opacity group-hover/menu-sub-item:${item.items && item.items.length > 0 ? 'opacity-0' : 'opacity-100'} `}/>
                            </span>}
                            <TruncatedText 
                              text={item.title}
                                maxWidth="130px"
                            />
                      </a>
                    )}
                  </SidebarMenuSubButton>
                  <div className="ml-auto flex items-center gap-1">
                    {getItemType(item) !== 'item' && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuAction className="right-[7px]">
                            <Plus />
                          </SidebarMenuAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          className="rounded-lg"
                          side={isMobile ? "bottom" : "right"}
                          // align={isMobile ? "end" : "start"}
                        >
                          {getItemType(item) === 'collection' && (
                            <DropdownMenuItem onClick={() => handleFolderClick(item)}>
                              <div className="flex items-start gap-2 cursor-pointer">
                                <Folder className="text-muted-foreground" />
                                <p>
                                  <span className="text-sm font-medium block">Folder</span>
                                  <span className="text-xs text-muted-foreground">
                                    Create a new folder to organize your projects
                                  </span>
                                </p>
                              </div>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleListClick(item)}>
                            <div className="flex items-start gap-2 cursor-pointer">
                              <ClipboardList className="text-muted-foreground" />
                              <p>
                                <span className="text-sm font-medium block">List</span>
                                <span className="text-xs text-muted-foreground">
                                  Track tasks, ideas, and more
                                </span>
                              </p>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <div className="flex items-start gap-2 cursor-pointer">
                              <FileText className="text-muted-foreground" />
                              <p>
                                <span className="text-sm font-medium block">Whiteboard</span>
                                <span className="text-xs text-muted-foreground">
                                  Collaborate with your team on ideas and plans
                                </span>
                              </p>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <div className="flex items-start gap-2 cursor-pointer">
                              <File className="text-muted-foreground" />
                              <p>
                                <span className="text-sm font-medium block">Doc</span>
                                <span className="text-xs text-muted-foreground">
                                  Share files, images, and more
                                </span>
                              </p>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <div className="flex items-start gap-2 cursor-pointer">
                              <Database className="text-muted-foreground" />
                              <p>
                                <span className="text-sm font-medium block">ERD</span>
                                <span className="text-xs text-muted-foreground">
                                  Visualize your database schema
                                </span>
                              </p>
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction className="right-[2.2rem]">
                          <MoreHorizontal />
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-64 rounded-lg p-2 space-y-1"
                        side={isMobile ? "bottom" : "right"}
                      >
                        <ItemContextMenu
                          kind={getItemType(item)}
                          title={item.title}
                          itemId={
                            getItemType(item) === 'collection'
                              ? extractCollectionId(item.url) || undefined
                              : getItemType(item) === 'folder'
                              ? extractFolderId(item.url) || undefined
                              : item.itemId
                          }
                          currentIconType={item.iconType}
                          currentIcon={item.icon}
                          currentColor={item.iconColor}
                          onCreateFolder={getItemType(item) === 'collection' ? () => handleFolderClick(item) : undefined}
                          onCreateList={getItemType(item) !== 'item' ? () => handleListClick(item) : undefined}
                          onCreateDoc={() => console.log('Create Doc for', item.title)}
                          onCreateWhiteboard={() => console.log('Create Whiteboard for', item.title)}
                          onCreateErd={() => console.log('Create ERD for', item.title)}
                          onMove={() => console.log('Move', item.title)}
                          onDelete={() => handleDeleteClick(item)}
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </>
              )}
            </SidebarMenuSubItem>
          </Collapsible>
        )
      })}

      {/* Modals */}
      <FolderModal
        open={folderModalOpen}
        onOpenChange={setFolderModalOpen}
        onSubmit={handleFolderSubmit}
        isLoading={createFolderLoading}
      />
      <ListModal
        open={listModalOpen}
        onOpenChange={setListModalOpen}
        onSubmit={handleListSubmit}
        isLoading={createListLoading}
      />

      {/* Delete Dialogs */}
      <DeleteCollectionDialog
        open={deleteCollectionOpen}
        onOpenChange={setDeleteCollectionOpen}
        onConfirm={handleDeleteCollection}
        collectionName={deleteTarget?.name || ''}
        isLoading={deleteCollectionLoading}
      />
      <DeleteFolderDialog
        open={deleteFolderOpen}
        onOpenChange={setDeleteFolderOpen}
        onConfirm={handleDeleteFolder}
        folderName={deleteTarget?.name || ''}
        isLoading={deleteFolderLoading}
      />
      <DeleteItemDialog
        open={deleteItemOpen}
        onOpenChange={setDeleteItemOpen}
        onConfirm={handleDeleteItem}
        itemName={deleteTarget?.name || ''}
        itemType={deleteTarget?.type}
        isLoading={deleteItemLoading}
      />
    </>
  )
}
