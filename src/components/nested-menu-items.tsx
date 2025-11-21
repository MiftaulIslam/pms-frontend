import { ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "./ui/sidebar";
export type NavItem = {
  title: string
  url: string
  items?: NavItem[]
}

export function NestedMenuItems({ items, level = 0 }: { items: NavItem[]; level?: number }) {
  return (
    <>
      {items.map((item) => (
        <Collapsible
          key={item.title}
          asChild
          defaultOpen={false}
          className="group/collapsible"
        >
          <SidebarMenuSubItem>
            {item.items && item.items.length > 0 ? (
              <>
                <CollapsibleTrigger asChild>
                  <SidebarMenuSubButton className="m-0 p-0">
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuSubButton>
                </CollapsibleTrigger>
                <CollapsibleContent >
                  <SidebarMenuSub className="m-0 p-0">
                    <NestedMenuItems items={item.items} level={level + 1} />
                  </SidebarMenuSub>
                </CollapsibleContent>
              </>
            ) : (
              <SidebarMenuSubButton asChild>
                <a href={item.url}>
                  <span>{item.title}</span>
                </a>
              </SidebarMenuSubButton>
            )}
          </SidebarMenuSubItem>
        </Collapsible>
      ))}
    </>
  )
}
