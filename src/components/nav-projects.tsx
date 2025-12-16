"use client"

import {
  ChevronRight,
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { NestedMenuItems, type NavItem } from "./nested-menu-items"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { useState } from "react"

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
  console.log("projects", projects)

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

  return (

    <SidebarGroup>
      <SidebarGroupLabel>Playground</SidebarGroupLabel>
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
                                className="
          size-4
            absolute opacity-0 transition-all duration-200
            group-hover/menu-item:opacity-100
            group-data-[state=open]/collapsible:rotate-90
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction >
                          <Plus />
                          <span className="sr-only">Add</span>
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-48 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align={isMobile ? "end" : "start"}
                      >
                        <DropdownMenuItem>
                          <Folder className="text-muted-foreground" />
                          <span>Add Folder</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Forward className="text-muted-foreground" />
                          <span>Add Item</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
                        <DropdownMenuItem>
                          <Trash2 className="text-muted-foreground" />
                          <span>Delete Project</span>
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
