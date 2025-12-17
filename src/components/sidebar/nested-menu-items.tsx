import { ChevronRight, MoreHorizontal, Plus, Folder, ClipboardList, FileText, File, Database, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { SidebarMenuAction, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar } from "../ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { DropdownMenu, DropdownMenuSeparator, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { FolderModal } from "./components/folder-modal";
import { ListModal } from "./components/list-modal";
import { useCreateEntity, extractCollectionId, extractFolderId } from "./hooks/use-create-entity";
    export type NavItem = {
  title: string
  url: string
  itemId?: string
  itemType?: 'list' | 'doc' | 'whiteboard'
  items?: NavItem[]
  icon?: LucideIcon
  collectionId?: string  // Added to track collection ID for folders
}

export function NestedMenuItems({ items, level = 0 }: { items: NavItem[]; level?: number }) {
  console.log("items", items)
  const { isMobile } = useSidebar();
  const { createFolder, createFolderLoading, createList, createListLoading } = useCreateEntity();
  
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [listModalOpen, setListModalOpen] = useState(false);
  const [currentParent, setCurrentParent] = useState<{ collectionId?: string | null; folderId?: string | null } | null>(null);

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
  return (
    <>
      {items.map((item) => {
        // Create a unique key for each item to ensure independent state
        const itemKey = `${item.title}-${item.url}-${level}`
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
                          <item.icon className="transition-opacity group-hover/menu-sub-item:opacity-0" />
                        )}

                        {item.items && item.items.length > 0 && (
                          <ChevronRight
                            className=" size-4 absolute opacity-0 transition-all duration-200  group-hover/menu-sub-item:opacity-100  group-data-[state=open]/collapsible-sub:rotate-90"
                          />
                        )}
                      </span>

                      {/* TITLE */}
                      <span>
                        {item.title.length > 10
                          ? item.title.slice(0, 16) + '...'
                          : item.title}
                      </span>

                    </SidebarMenuSubButton>
                    {/* <SidebarMenuSubButton className="m-0 p-0">

                      <Tooltip>
                        <TooltipTrigger className="flex items-center gap-2">
                          {item.icon && <item.icon className="size-4" />}
                          <span>{item.title.length > 16 ? item.title.slice(0, 16) + '...' : item.title}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{item.title}</p>
                        </TooltipContent>
                      </Tooltip>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible-sub:rotate-90" />
                    </SidebarMenuSubButton> */}
                    
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
              align={isMobile ? "end" : "start"}
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
          <DropdownMenuContent side={isMobile ? "bottom" : "right"}>
            <DropdownMenuItem>View</DropdownMenuItem>
            <DropdownMenuItem>Share</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Delete</DropdownMenuItem>
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
                        <Tooltip>
                          <TooltipTrigger className="flex items-center gap-2">
                            {item.icon && <item.icon className="size-4" />}
                            <span>{item.title.length > 16 ? item.title.slice(0, 16) + '...' : item.title}</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{item.title}</p>
                          </TooltipContent>
                        </Tooltip>
                      </Link>
                    ) : (
                      <a href={item.url}>
                        <Tooltip>
                          <TooltipTrigger className="flex items-center gap-2">
                            {item.icon && <item.icon className="size-4" />}
                            <span>{item.title.length > 16 ? item.title.slice(0, 16) + '...' : item.title}</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{item.title}</p>
                          </TooltipContent>
                        </Tooltip>
                      </a>
                    )}
                  </SidebarMenuSubButton>
                  {getItemType(item) !== 'item' && (
                    <div className="ml-auto flex items-center gap-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuAction className="right-[7px]">
                            <Plus />
                          </SidebarMenuAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                          className="rounded-lg"
                          side={isMobile ? "bottom" : "right"}
                          align={isMobile ? "end" : "start"}
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuAction className="right-[2.2rem]">
                            <MoreHorizontal />
                          </SidebarMenuAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side={isMobile ? "bottom" : "right"}>
                          <DropdownMenuItem>View</DropdownMenuItem>
                          <DropdownMenuItem>Share</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
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
    </>
  )
}
