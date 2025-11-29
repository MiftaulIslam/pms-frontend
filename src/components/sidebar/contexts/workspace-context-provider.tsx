import * as React from "react"
import type { Workspace } from "@/components/sidebar/types/sidebar-types"
import { WorkspaceContext } from "./workspace-context"

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
    const [currentWorkspaceId, setCurrentWorkspaceId] = React.useState<string | null>(null)
    const [workspaces, setWorkspaces] = React.useState<Workspace[]>([])

    return (
        <WorkspaceContext.Provider value={{
            currentWorkspaceId,
            setCurrentWorkspaceId,
            workspaces,
            setWorkspaces
        }}>
            {children}
        </WorkspaceContext.Provider>
    )
}
