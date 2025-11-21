import type { DummyProjectInterface } from "../interfaces/dummy-project-interface";

export const dummyProjectModel: DummyProjectInterface[] = [
    {
        id: "proj-001",
        workspaceid: "wps-001",
        collectionid: "col-001",
        folderid:"fol-001",
        name: "Project 1",
        description: "Project 1 description",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "proj-002",
        workspaceid: "wps-001",
        collectionid: "col-001",
        folderid:"fol-001",
        name: "Project 2",
        description: "Project 2 description",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
]