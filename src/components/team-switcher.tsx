import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"

interface Team {
  name: string
  logo: React.ElementType | string
  id: string
}

interface TeamSwitcherProps {
  teams: Team[]
  onWorkspaceSwitch?: (workspaceId: string) => void
  currentWorkspaceId?: string
}

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function TeamSwitcher({
  teams,
  onWorkspaceSwitch,
  currentWorkspaceId,
}: TeamSwitcherProps) {
  const { isMobile } = useSidebar()
  
  // Find the active team based on currentWorkspaceId
  const activeTeam = React.useMemo(() => {
    if (currentWorkspaceId) {
      return teams.find(team => team.id === currentWorkspaceId) || teams[0]
    }
    return teams[0]
  }, [teams, currentWorkspaceId])

  if (!activeTeam || teams.length === 0) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                {typeof activeTeam.logo === 'string' ? (
                  <img src={activeTeam.logo} alt={activeTeam.name} className="size-6 rounded" />
                ) : (
                  <activeTeam.logo className="size-6" />
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeTeam.name}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Teams
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => {
                  onWorkspaceSwitch?.(team.id)
                }}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  {typeof team.logo === 'string' ? (
                    <img src={team.logo} alt={team.name} className="size-3.5 shrink-0 rounded" />
                  ) : (
                    <team.logo className="size-3.5 shrink-0" />
                  )}
                </div>
                {team.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
