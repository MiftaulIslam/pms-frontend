
import * as React from "react"
import {
  BookOpen,
  Bot,
  Frame,
  GalleryVerticalEnd,
  Settings2,
  SquareTerminal,
  Loader2,
  Folder,
  FileText,
  Paintbrush,
  LayoutDashboard,
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/sidebar/nav-projects"
import { NavUser } from "@/components/sidebar/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from "@/pages/auth/context/use-auth"
import { getMyWorkspaces, WORKSPACE_APIS } from "./api/workspace-api"
import type { Workspace } from "./types/sidebar-types"
import { useWorkspace } from "@/components/sidebar/contexts/workspace-context/use-workspace"
import { useCollections } from "./hooks/use-collections"
import type { PlaygroundCollection, PlaygroundFolder } from "./types/playground-types"
import type { IconType } from "./types/playground-types"
import type { NavItem } from "@/components/sidebar/nested-menu-items"
import type { LucideIcon } from "lucide-react"

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

/**
 * Helper function to get icon component based on iconType and icon value
 * Returns a LucideIcon component or a wrapper that renders emoji/image
 */
export function getIconComponent(iconType: IconType | null, icon: string | null, defaultIcon: LucideIcon): LucideIcon {
  if (iconType === 'emoji' && icon) {
    // For emoji, create a wrapper component that renders emoji in SVG foreignObject
    const EmojiIcon = React.forwardRef<SVGSVGElement, React.ComponentProps<typeof defaultIcon>>(
      (props, ref) => {
        const IconComponent = defaultIcon;
        return (
          <IconComponent {...props} ref={ref}>
            <foreignObject x="0" y="0" width="16" height="16">
              <div className="flex items-center justify-center w-full h-full text-sm">{icon}</div>
            </foreignObject>
          </IconComponent>
        );
      }
    );
    EmojiIcon.displayName = 'EmojiIcon';
    return EmojiIcon as LucideIcon;
  }
  if (iconType === "image" && icon) {
    // For image, create a wrapper that renders the image
    const imageUrl = icon.startsWith('http') ? icon : `${import.meta.env.VITE_BACKEND_API}${icon}`;
    const ImageIcon = React.forwardRef<SVGSVGElement, React.ComponentProps<typeof defaultIcon>>(
      (props, ref) => {
        const IconComponent = defaultIcon;
        return (
          <IconComponent {...props} ref={ref}>
            <foreignObject x="0" y="0" width="16" height="16">
              <img 
                src={imageUrl} 
                alt="" 
                className="w-4 h-4 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </foreignObject>
          </IconComponent>
        );
      }
    );
    ImageIcon.displayName = 'ImageIcon';
    return ImageIcon as LucideIcon;
  }
  return defaultIcon;
}

/**
 * Transforms folders and items to NavItem format recursively
 * @param folders - Folders to transform
 * @param collectionId - Collection ID that these folders belong to
 */
function transformFoldersToNavItems(folders: PlaygroundFolder[], collectionId: string): NavItem[] {
  return folders.map((folder) => {
    // Get default icon for folder
    const folderDefaultIcon = Folder;
    const folderIcon = getCachedIconComponent(folder.iconType, folder.icon, folderDefaultIcon);
    
    return {
      title: folder.name,
      url: `#folder-${folder.id}`,
      icon: folderIcon,
      collectionId: collectionId, // Pass collection ID for folder items
      items: [
        ...transformFoldersToNavItems(folder.childFolders),
        ...folder.items.map((item) => {
          // Get default icon based on item type
          let itemDefaultIcon: LucideIcon = Frame;
          if (item.type === 'list') itemDefaultIcon = LayoutDashboard;
          else if (item.type === 'doc') itemDefaultIcon = FileText;
          else if (item.type === 'whiteboard') itemDefaultIcon = Paintbrush;
          
          const itemIcon = getCachedIconComponent(item.iconType, item.icon, itemDefaultIcon);
          
          return {
            title: item.name,
            url: item.type === 'list' ? `/dashboard/list/${item.id}` : item.type === 'doc' ? `/dashboard/doc/${item.id}` : item.type === 'whiteboard' ? `/dashboard/whiteboard/${item.id}` : `#item-${item.id}`,
            itemId: item.id,
            itemType: item.type,
            icon: itemIcon,
            collectionId: collectionId, // Pass collection ID for items in folders
          };
        }),
      ],
    };
  });
}

/**
 * Memoized icon component cache to avoid recreating components
 */
const iconComponentCache = new Map<string, LucideIcon>();

/**
 * Gets or creates an icon component with caching
 */
function getCachedIconComponent(iconType: IconType | null, icon: string | null, defaultIcon: LucideIcon): LucideIcon {
  const cacheKey = `${iconType || 'default'}-${icon || 'default'}`;
  
  if (iconComponentCache.has(cacheKey)) {
    return iconComponentCache.get(cacheKey)!;
  }
  
  const iconComponent = getIconComponent(iconType, icon, defaultIcon);
  iconComponentCache.set(cacheKey, iconComponent);
  return iconComponent;
}

/**
 * Transforms collections to projects format for NavProjects component
 */
function transformCollectionsToProjects(collections: PlaygroundCollection[]) {
  return collections.map((collection) => {
    const IconComponent = getCachedIconComponent(collection.iconType, collection.icon, Frame);
    
    // Transform folders and items to NavItem format
    const navItems: NavItem[] = [
      ...transformFoldersToNavItems(collection.folders, collection.id),
      ...collection.items.map((item) => {
        // Get default icon based on item type
        let itemDefaultIcon: LucideIcon = Frame;
        if (item.type === 'list') itemDefaultIcon = LayoutDashboard;
        else if (item.type === 'doc') itemDefaultIcon = FileText;
        else if (item.type === 'whiteboard') itemDefaultIcon = Paintbrush;
        
        const itemIcon = getCachedIconComponent(item.iconType, item.icon, itemDefaultIcon);
        
        return {
          title: item.name,
          url: item.type === 'list' ? `/dashboard/list/${item.id}` : item.type === 'doc' ? `/dashboard/doc/${item.id}` : item.type === 'whiteboard' ? `/dashboard/whiteboard/${item.id}` : `#item-${item.id}`,
          itemId: item.id,
          itemType: item.type,
          icon: itemIcon,
        };
      }),
    ];

    return {
      title: collection.name,
      url: `#collection-${collection.id}`,
      icon: IconComponent,
      isActive: false,
      items: navItems.length > 0 ? navItems : undefined,
    };
  });
}

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

  // Fetch collections for the current workspace
  const { collections, isLoading: isLoadingCollections } = useCollections()
  
  // Debug logging
  React.useEffect(() => {
  }, [collections, isLoadingCollections])

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

  // Handle workspace switching
  const handleWorkspaceSwitch = React.useCallback(async (workspaceId: string) => {
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
  }, [setCurrentWorkspaceId]);
  
  // Transform workspaces for TeamSwitcher component
  const teams = React.useMemo(() => {
    return workspaces?.map((workspace: Workspace) => ({
      name: workspace.name,
      logo: workspace.logo ? `${import.meta.env.VITE_BACKEND_API}${workspace.logo}` : GalleryVerticalEnd,
      id: workspace.id,
    })) || []
  }, [workspaces])

  // Transform collections to projects format
  const projectsData = React.useMemo(() => {
    if (!collections || !Array.isArray(collections) || collections.length === 0) {
      return [];
    }
    return transformCollectionsToProjects(collections);
  }, [collections])

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
        {isLoadingCollections ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : (
        <NavProjects projects={projectsData} />
        )}
      </SidebarContent>
      <SidebarFooter>
        {user && <NavUser user={user} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
