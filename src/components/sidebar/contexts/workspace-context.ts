import * as React from "react"
import type { WorkspaceContextType } from "../types/sidebar-types"



export const WorkspaceContext = React.createContext<WorkspaceContextType | undefined>(undefined)
