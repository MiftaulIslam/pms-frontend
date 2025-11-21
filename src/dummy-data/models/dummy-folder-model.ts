export interface DummyFolderInterface {
  id: string;
  ownerid: string;
  collectionid: string;
  projects: string[];
  workspaceid: string;
  name: string;
  description: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}
export const dummyFolderModel: DummyFolderInterface[] = [
  {
    id: "fol-001",
    ownerid: "3f29b8a2-6c1d-4d9b-bf4c-9a2f1d5c7e3a",
    collectionid: "col-001",
    projects: ["proj-001", "proj-002"],
    workspaceid: "wps-001",
    name: "Folder 001",
    description: "Nothing yet",
    icon: "folders",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "fol-002",
    ownerid: "3f29b8a2-6c1d-4d9b-bf4c-9a2f1d5c7e3a",
    workspaceid: "wps-001",
    collectionid: "col-001",
    projects: ["proj-001", "proj-002"],
    name: "Folder 002",
    description: "Nothing yet",
    icon: "folders",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "fol-0023",
    ownerid: "3f29b8a2-6c1d-4d9b-bf4c-9a2f1d5c7e3a",
    workspaceid: "wps-002",
    collectionid: "col-001",
    projects: ["proj-001", "proj-002"],
    name: "Folder 003",
    description: "Nothing yet",
    icon: "folders",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
