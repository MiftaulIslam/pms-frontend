
import * as React from "react"
import {
  BookOpen,
  Bot,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Loader2,
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from "@/pages/auth/context/use-auth"
import { getMyWorkspaces, WORKSPACE_APIS } from "./api/sidebar-api"
import type { Workspace } from "./types/sidebar-types"
import { useWorkspace } from "./contexts/use-workspace"

// Static navigation data
const navMain = [
  {
    title: "Playground",
    url: "#",
    icon: SquareTerminal,
    isActive: true,
    items: [
      {
        title: "History",
        url: "#",
      },
      {
        title: "Starred",
        url: "#",
      },
      {
        title: "Settings",
        url: "#",
      },
    ],
  },
  {
    title: "Models",
    url: "#",
    icon: Bot,
    items: [
      {
        title: "Genesis",
        url: "#",
      },
      {
        title: "Explorer",
        url: "#",
      },
      {
        title: "Quantum",
        url: "#",
      },
    ],
  },
  {
    title: "Documentation",
    url: "#",
    icon: BookOpen,
    items: [
      {
        title: "Introduction",
        url: "#",
      },
      {
        title: "Get Started",
        url: "#",
      },
      {
        title: "Tutorials",
        url: "#",
      },
      {
        title: "Changelog",
        url: "#",
      },
    ],
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings2,
    items: [
      {
        title: "General",
        url: "#",
      },
      {
        title: "Team",
        url: "#",
      },
      {
        title: "Billing",
        url: "#",
      },
      {
        title: "Limits",
        url: "#",
      },
    ],
  },
];

const projects = [
  {
    title: "Design Engineering",
    url: "#",
    icon: Frame,
    isActive: true,
    items: [
      {
        title: "General",
        url: "#",
      },
      {
        title: "Team",
        url: "#",
      },
      {
        title: "Billing",
        url: "#",
      },
      {
        title: "Limits",
        url: "#",
      },
    ],
  },
  {
    title: "Sales & Marketing",
    url: "#",
    icon: PieChart,
  },
  {
    title: "Travel",
    url: "#",
    icon: Map,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  const { setCurrentWorkspaceId, workspaces, setWorkspaces, currentWorkspaceId } = useWorkspace()
  
  // Fetch workspaces with tanStack Query
  const { data: workspacesData, isLoading } = useQuery({
    queryKey: ['workspaces'],
    queryFn: getMyWorkspaces,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (gcTime replaced cacheTime)
  })

  // Handle workspace selection logic
  React.useEffect(() => {
    if (workspacesData) {
      setWorkspaces(workspacesData.workspaces)
      
      // If user has lastWorkspaceId, select that workspace
      if (user?.lastWorkspaceId) {
        setCurrentWorkspaceId(user.lastWorkspaceId)
      } else {
        // Otherwise select the first workspace
        if (workspacesData.workspaces.length > 0) {
          setCurrentWorkspaceId(workspacesData.workspaces[0].id)
        }
      }
    }
  }, [workspacesData, user?.lastWorkspaceId, setCurrentWorkspaceId, setWorkspaces])

  // Show loading spinner while fetching workspaces
  if (isLoading) {
    return (
      <Sidebar {...props}>
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </Sidebar>
    )
  }

  // Handle workspace switching
  const handleWorkspaceSwitch = async (workspaceId: string) => {
    try {
      const accessToken = localStorage.getItem("access_token");
      
      // Update current workspace in context
      setCurrentWorkspaceId(workspaceId)
      
      // Call WORKSPACE_BY_ID to update lastWorkspaceId
      await fetch(WORKSPACE_APIS(workspaceId).WORKSPACE_BY_ID, {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      
      // Invalidate workspaces query to refresh data
      // This will trigger a refetch and update the lastWorkspaceId
      // queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    } catch (error) {
      console.error('Failed to switch workspace:', error);
    }
  };
  
  // Transform workspaces for TeamSwitcher component
  const teams = workspaces?.map((workspace: Workspace) => ({
    name: workspace.name,
    logo: workspace.logo ? `${import.meta.env.VITE_BACKEND_API}${workspace.logo}` : GalleryVerticalEnd,
    id: workspace.id,
  })) || []
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher 
          teams={teams} 
          onWorkspaceSwitch={handleWorkspaceSwitch}
          currentWorkspaceId={currentWorkspaceId || undefined}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavProjects projects={projects} />
      </SidebarContent>
      <SidebarFooter>
        {user && <NavUser user={user} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
