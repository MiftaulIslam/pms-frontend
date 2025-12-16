import * as React from "react"
import { WorkspaceContext } from "@/components/sidebar/contexts/workspace-context/workspace-context"

export const useWorkspace = () => {
  const context = React.useContext(WorkspaceContext)
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider')
  }
  return context
}
