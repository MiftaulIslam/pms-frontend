
import type { dummyUserInterface } from "./dummy-user-interface"

export interface dummyWorkspaceInterface {
    id: string
    ownerid: string,
    name: string
    description: string
    image: string
    members: dummyUserInterface[]
    collections?: string[]
    type: "organization" | "personal"
    tags?: string[]
    createdAt: string
    updatedAt: string
}