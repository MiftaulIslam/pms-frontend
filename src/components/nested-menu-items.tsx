import { ChevronRight, MoreHorizontal, Plus, Folder, ClipboardList, FileText, File, Database, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { SidebarMenuAction, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar } from "./ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { DropdownMenu, DropdownMenuSeparator, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
    export type NavItem = {
  title: string
  url: string
  itemId?: string
  itemType?: 'list' | 'doc' | 'whiteboard'
  items?: NavItem[]
  icon?: LucideIcon
}

export function NestedMenuItems({ items, level = 0 }: { items: NavItem[]; level?: number }) {
  console.log("items", items)
  const { isMobile } = useSidebar();

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
                <DropdownMenuItem>
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
              <DropdownMenuItem>
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
                            <DropdownMenuItem>
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
                          <DropdownMenuItem>
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
    </>
  )
}
