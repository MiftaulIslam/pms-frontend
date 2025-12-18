"use client"

import {
  ChevronRight,
  ClipboardList,
  Database,
  File,
  FileText,
  Folder,
  Forward,
  MoreHorizontal,
  Plus,
  Trash2,
  type LucideIcon,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  // SidebarMenuSubButton,
  // SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"
import { NestedMenuItems, type NavItem } from "./nested-menu-items"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { useState } from "react"
import { useCreateEntity, extractCollectionId } from "./hooks/use-create-entity"
import { useDeleteEntity } from "./hooks/use-delete-entity"
import { FolderModal } from "./components/folder-modal"
import { ListModal } from "./components/list-modal"
import { CreateCollectionModal } from "./components/create-collection-modal"
import { DeleteCollectionDialog, DeleteFolderDialog, DeleteItemDialog } from "./components/delete-confirmation"

type ProjectItem = {
  title: string
  url: string
  icon: LucideIcon
  isActive?: boolean
  items?: NavItem[]
}
export function NavProjects({
  projects,
}: {
  projects: ProjectItem[]
}) {

  // Initialize with active projects
  const [openProjects, setOpenProjects] = useState<Set<string>>(() => {
    const initialSet = new Set<string>()
    projects.forEach(project => {
      if (project.isActive) {
        initialSet.add(project.title)
      }
    })
    return initialSet
  })
  const { isMobile } = useSidebar()
  const { createFolder, createFolderLoading, createList, createListLoading, createCollection, createCollectionLoading } = useCreateEntity()
  const { deleteCollection, deleteCollectionLoading, deleteFolder, deleteFolderLoading, deleteItem, deleteItemLoading } = useDeleteEntity()
  
  const [collectionModalOpen, setCollectionModalOpen] = useState(false)
  const [folderModalOpen, setFolderModalOpen] = useState(false)
  const [listModalOpen, setListModalOpen] = useState(false)
  const [currentParent, setCurrentParent] = useState<{ collectionId?: string | null } | null>(null)
  
  // Delete state
  const [deleteCollectionOpen, setDeleteCollectionOpen] = useState(false)
  const [deleteFolderOpen, setDeleteFolderOpen] = useState(false)
  const [deleteItemOpen, setDeleteItemOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string; type?: 'list' | 'doc' | 'whiteboard' } | null>(null)

  // Helper function to determine item type from URL
  const getItemType = (url: string): 'collection' | 'folder' | 'item' => {
    if (url.startsWith('#collection-')) {
      return 'collection'
    }
    if (url.startsWith('#folder-')) {
      return 'folder'
    }
    return 'item'
  }

  const handleOpenChange = (title: string, isOpen: boolean) => {
    setOpenProjects(prev => {
      const newSet = new Set(prev)
      if (isOpen) {
        newSet.add(title)
      } else {
        newSet.delete(title)
      }
      return newSet
    })
  }

  const handleFolderClick = (item: ProjectItem) => {
    const collectionId = extractCollectionId(item.url)
    setCurrentParent({ collectionId: collectionId || null })
    setFolderModalOpen(true)
  }

  const handleListClick = (item: ProjectItem) => {
    const collectionId = extractCollectionId(item.url)
    if (!collectionId) {
      console.error('Collection ID is required for list creation')
      return
    }
    setCurrentParent({ collectionId })
    setListModalOpen(true)
  }

  const handleFolderSubmit = async (data: { name: string; description?: string }) => {
    if (!currentParent) return
    await createFolder({
      collectionId: currentParent.collectionId || null,
      parentFolderId: null,
      name: data.name,
      description: data.description,
    })
  }

  const handleListSubmit = async (data: { name: string; description?: string; columns: Array<{ title: string; position: number; color?: string | null }> }) => {
    if (!currentParent?.collectionId) return
    await createList({
      collectionId: currentParent.collectionId,
      parentFolderId: null,
      name: data.name,
      description: data.description,
      columns: data.columns,
    })
  }

  const handleCollectionSubmit = async (data: { name: string; description?: string }) => {
    await createCollection({
      name: data.name,
      description: data.description,
    })
  }

  const handleDeleteClick = (item: ProjectItem) => {
    const itemType = getItemType(item.url)
    const id = extractCollectionId(item.url)
    if (!id) return
    
    setDeleteTarget({ id, name: item.title })
    
    if (itemType === 'collection') {
      setDeleteCollectionOpen(true)
    } else if (itemType === 'folder') {
      setDeleteFolderOpen(true)
    } else {
      // For items, we'd need itemType from the item
      setDeleteItemOpen(true)
    }
  }

  const handleDeleteCollection = async () => {
    if (!deleteTarget) return
    await deleteCollection(deleteTarget.id)
    setDeleteCollectionOpen(false)
    setDeleteTarget(null)
  }

  const handleDeleteFolder = async () => {
    if (!deleteTarget) return
    await deleteFolder(deleteTarget.id)
    setDeleteFolderOpen(false)
    setDeleteTarget(null)
  }

  const handleDeleteItem = async () => {
    if (!deleteTarget) return
    await deleteItem(deleteTarget.id)
    setDeleteItemOpen(false)
    setDeleteTarget(null)
  }
  return (

    <SidebarGroup>
      <div className="flex items-center justify-between px-2">
        <SidebarGroupLabel>Playground</SidebarGroupLabel>
        <button
          onClick={() => setCollectionModalOpen(true)}
          className="flex h-6 w-6 items-center justify-center rounded-md text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          aria-label="Create collection"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <SidebarMenu>
        {projects.map((item) => (
          <>
            <Collapsible
              key={item.title}
              asChild
              open={openProjects.has(item.title)}
              onOpenChange={(isOpen) => handleOpenChange(item.title, isOpen)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.title}
                          className="group/menu-item"
                        >
                          {/* ICON */}
                          <span className="relative flex h-4 w-4 items-center justify-center">
                            {item.icon && (
                              <item.icon className="transition-opacity group-hover/menu-item:opacity-0" />
                            )}

                            {item.items && item.items.length > 0 && (
                              <ChevronRight
                                className=" size-4 absolute opacity-0 transition-all duration-200 group-hover/menu-item:opacity-100 group-data-[state=open]/collapsible:rotate-90
          "
                              />
                            )}
                          </span>

                          {/* TITLE */}
                          <span>
                            {item.title.length > 10
                              ? item.title.slice(0, 16) + '...'
                              : item.title}
                          </span>

                          <TooltipContent>
                            <p>{item.title}</p>
                          </TooltipContent>
                        </SidebarMenuButton>
                        {/* <SidebarMenuButton tooltip={item.title} >
                          {item.icon && <item.icon />}
                          <span>{item.title.length > 10 ? item.title.slice(0, 16) + '...' : item.title}</span>
                          <TooltipContent>
                            <p>{item.title}</p>
                          </TooltipContent>

                          {item.items && item.items.length > 0 && (
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          )}
                        </SidebarMenuButton> */}
                      </TooltipTrigger>
                    </Tooltip>
                    {getItemType(item.url) !== 'item' && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuAction >
                            <Plus />
                            <span className="sr-only">Add</span>
                          </SidebarMenuAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          className=" rounded-lg"
                          side={isMobile ? "bottom" : "right"}
                          align={isMobile ? "end" : "start"}
                        >
                          {getItemType(item.url) === 'collection' && (
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
                        <SidebarMenuAction className="right-8">
                          <MoreHorizontal />
                          <span className="sr-only">More</span>
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-48 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align={isMobile ? "end" : "start"}
                      >
                        <DropdownMenuItem>
                          <Folder className="text-muted-foreground" />
                          <span>View Project</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Forward className="text-muted-foreground" />
                          <span>Share Project</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          variant="destructive"
                          onClick={() => handleDeleteClick(item)}
                        >
                          <Trash2 className="text-muted-foreground" />
                          <span>Delete {getItemType(item.url) === 'collection' ? 'Collection' : getItemType(item.url) === 'folder' ? 'Folder' : 'Item'}</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CollapsibleTrigger>
                {item.items && item.items.length > 0 && (
                  <CollapsibleContent>
                    <SidebarMenuSub className="m-0 p-0! relative left-0.5">
                      <NestedMenuItems items={item.items} />
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          </>




          // <Collapsible
          //   key={item.title}
          //   asChild
          //   defaultOpen={item.isActive}
          //   className="group/collapsible"
          // >
          //   <SidebarMenuItem>
          //     <CollapsibleTrigger asChild>
          //       <div>
          //         <SidebarMenuButton tooltip={item.title}>
          //           {item.icon && <item.icon />}
          //           <span>{item.title}</span>
          //           {
          //             item.items && (
          //               <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          //             )
          //           }
          //         </SidebarMenuButton>
          //         <DropdownMenu>
          //           <DropdownMenuTrigger asChild>
          //             <SidebarMenuAction>
          //               <MoreHorizontal />
          //               <span className="sr-only">More</span>
          //             </SidebarMenuAction>
          //           </DropdownMenuTrigger>
          //           <DropdownMenuContent
          //             className="w-48 rounded-lg"
          //             side={isMobile ? "bottom" : "right"}
          //             align={isMobile ? "end" : "start"}
          //           >
          //             <DropdownMenuItem>
          //               <Folder className="text-muted-foreground" />
          //               <span>View Project</span>
          //             </DropdownMenuItem>
          //             <DropdownMenuItem>
          //               <Forward className="text-muted-foreground" />
          //               <span>Share Project</span>
          //             </DropdownMenuItem>
          //             <DropdownMenuSeparator />
          //             <DropdownMenuItem>
          //               <Trash2 className="text-muted-foreground" />
          //               <span>Delete Project</span>
          //             </DropdownMenuItem>
          //           </DropdownMenuContent>
          //         </DropdownMenu>
          //       </div>
          //     </CollapsibleTrigger>
          //     <CollapsibleContent>
          //       <SidebarMenuSub>
          //         {item.items?.map((subItem) => (
          //           <SidebarMenuSubItem key={subItem.title}>
          //             <SidebarMenuSubButton asChild>
          //               <a href={subItem.url}>
          //                 <span>{subItem.title}</span>
          //               </a>
          //             </SidebarMenuSubButton>
          //           </SidebarMenuSubItem>
          //         ))}
          //       </SidebarMenuSub>
          //     </CollapsibleContent>
          //   </SidebarMenuItem>
          // </Collapsible>

        ))}
      </SidebarMenu>
      
      {/* Modals */}
      <CreateCollectionModal
        open={collectionModalOpen}
        onOpenChange={setCollectionModalOpen}
        onSubmit={handleCollectionSubmit}
        isLoading={createCollectionLoading}
      />
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
    </SidebarGroup>





    // <SidebarGroup >
    //   <SidebarGroupLabel>Projects</SidebarGroupLabel>
    //   <SidebarMenu>
    //     {projects.map((item) => (
    //       <SidebarMenuItem key={item.title}>
    //         <SidebarMenuButton asChild>
    //           <a href={item.url}>
    //             <item.icon />
    //             <span>{item.title}</span>
    //           </a>
    //         </SidebarMenuButton>
    //         <DropdownMenu>
    //           <DropdownMenuTrigger asChild>
    //             <SidebarMenuAction showOnHover>
    //               <MoreHorizontal />
    //               <span className="sr-only">More</span>
    //             </SidebarMenuAction>
    //           </DropdownMenuTrigger>
    //           <DropdownMenuContent
    //             className="w-48 rounded-lg"
    //             side={isMobile ? "bottom" : "right"}
    //             align={isMobile ? "end" : "start"}
    //           >
    //             <DropdownMenuItem>
    //               <Folder className="text-muted-foreground" />
    //               <span>View Project</span>
    //             </DropdownMenuItem>
    //             <DropdownMenuItem>
    //               <Forward className="text-muted-foreground" />
    //               <span>Share Project</span>
    //             </DropdownMenuItem>
    //             <DropdownMenuSeparator />
    //             <DropdownMenuItem>
    //               <Trash2 className="text-muted-foreground" />
    //               <span>Delete Project</span>
    //             </DropdownMenuItem>
    //           </DropdownMenuContent>
    //         </DropdownMenu>
    //       </SidebarMenuItem>
    //     ))}
    //     <SidebarMenuItem>
    //       <SidebarMenuButton className="text-sidebar-foreground/70">
    //         <MoreHorizontal className="text-sidebar-foreground/70" />
    //         <span>More</span>
    //       </SidebarMenuButton>
    //     </SidebarMenuItem>
    //   </SidebarMenu>
    // </SidebarGroup>
  )
}
