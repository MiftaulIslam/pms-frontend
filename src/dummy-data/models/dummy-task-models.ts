import type { DummyTaskInterface } from "../interfaces/dummy-task-interface"

export const dummyTasks: DummyTaskInterface[] = [
  {
    id: "tsk-001",
    workspaceId: "wps-001",
    collectionId: "col-001",
    projectId: "proj-001",
    createdBy: "3f29b8a2-6c1d-4d9b-bf4c-9a2f1d5c7e3a",
    name: "Design wireframes",
    description: "Create initial low-fidelity wireframes",
    priority: "medium",
    status: "todo",
    startedAt: new Date().toISOString(),
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    assigneeIds: ["3f29b8a2-6c1d-4d9b-bf4c-9a2f1d5c7e3b"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tsk-002",
    workspaceId: "wps-001",
    collectionId: "col-001",
    projectId: "proj-001",
    createdBy: "3f29b8a2-6c1d-4d9b-bf4c-9a2f1d5c7e3a",
    name: "Set up repo",
    description: "Initialize monorepo with tooling",
    priority: "high",
    status: "in-progress",
    startedAt: new Date().toISOString(),
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    assigneeIds: ["3f29b8a2-6c1d-4d9b-bf4c-9a2f1d5c7e3a"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

