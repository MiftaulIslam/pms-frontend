import type { DummyStatusInterface } from "../interfaces/dummy-status-interface";

export const dummyStatus: DummyStatusInterface[] = [
    {
        id: 'sta-001',
        workspaceId: 'wps-001',
        projectId: 'proj-001',
        name: 'Todo',
        description: 'The task is not started yet',
        color: 'red',
        order: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
]