//

export interface DummyTaskInterface {
    id: string
    workspaceId: string
    collectionId?: string
    projectId: string
    createdBy: string
    name: string
    description: string
    priority: "low" | "medium" | "high"
    status: "todo" | "in-progress" | "halted" | "done"
    startedAt: string
    deadline: string
    assigneeIds?: string[]
    createdAt: string
    updatedAt: string
}