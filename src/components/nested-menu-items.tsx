import { ChevronRight, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "./ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
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
                      className="group/menu-sub-item"
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
                  <CollapsibleContent >
                    <SidebarMenuSub className="m-0 p-0">
                      <NestedMenuItems items={item.items} level={level + 1} />
                    </SidebarMenuSub>
                  </CollapsibleContent>

                </>
              ) : (
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
              )}
            </SidebarMenuSubItem>
          </Collapsible>
        )
      })}
    </>
  )
}
