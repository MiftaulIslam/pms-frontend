export interface Workspace {
    id: string;
    name: string;
    logo: string | null;
    createdAt: string;
    ownerId: string;
    owner: {
        id: string;
        name: string;
        email: string;
        avatar: string;
        createdAt: string;
        updatedAt: string;
        onboarded: boolean;
        heardAboutUs: string;
        interestIn: string[];
        lastWorkspaceId: string;
    };
}

export interface WorkspacesResponse {
    workspaces: Workspace[];
    lastWorkspaceId: string;
}

export interface WorkspaceContextType {
    currentWorkspaceId: string | null
    setCurrentWorkspaceId: (id: string) => void
    workspaces: Workspace[]
    setWorkspaces: (workspaces: Workspace[]) => void
}