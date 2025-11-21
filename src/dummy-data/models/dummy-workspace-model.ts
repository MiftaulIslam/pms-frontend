import { type dummyWorkspaceInterface } from "../interfaces/dummy-workspace-model";

export const dummyWorkspace: dummyWorkspaceInterface[] = [
    {
        id: 'wps-001',
        ownerid: '3f29b8a2-6c1d-4d9b-bf4c-9a2f1d5c7e3a',
        name: "Farhan's Workspace",
        description: "Nothing yet",
        image: '/workspace01.webp',
        type: "organization",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        members: [
            {
                id: '3f29b8a2-6c1d-4d9b-bf4c-9a2f1d5c7e3a',
                new: true,
                profile: {
                    name: 'Farhan Nisar',
                    email: 'farhannisar306@gmail.com',
                    phone: '1234567890',
                    address: '123 Main St',
                    image: 'https://biographybd.com/wp-content/uploads/2015/11/Anisur-Rahman-Milon.gif',
                    gender: 'male'
                }
            },
            {
                id: '3f29b8a2-6c1d-4d9b-bf4c-9a2f1d5c7e3b',
                new: false,
                profile: {
                    name: 'Miftaul Islam Ariyan',
                    email: 'miftaulislam005@gmail.com',
                    phone: '1234567890',
                    address: '123 Main St',
                    image: 'https://biographybd.com/wp-content/uploads/2015/11/Anisur-Rahman-Milon.gif',
                    gender: 'male'
                }
            }
        ],
        collections:["col-001", "col-002"]
    },
    {
        id: 'wps-002',
        ownerid: '3f29b8a2-6c1d-4d9b-bf4c-9a2f1d5c7e3a',
        name: "Miftaul's Workspace",
        description: "Nothing yet",
        image: '/workspace02.webp',
        type: "organization",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        members: [
            {
                id: '3f29b8a2-6c1d-4d9b-bf4c-9a2f1d5c7e3a',
                new: true,
                profile: {
                    name: 'Farhan Nisar',
                    email: 'farhannisar306@gmail.com',
                    phone: '1234567890',
                    address: '123 Main St',
                    image: 'https://biographybd.com/wp-content/uploads/2015/11/Anisur-Rahman-Milon.gif',
                    gender: 'male'
                }
            },
            {
                id: '3f29b8a2-6c1d-4d9b-bf4c-9a2f1d5c7e3b',
                new: false,
                profile: {
                    name: 'Miftaul Islam Ariyan',
                    email: 'miftaulislam005@gmail.com',
                    phone: '1234567890',
                    address: '123 Main St',
                    image: 'https://biographybd.com/wp-content/uploads/2015/11/Anisur-Rahman-Milon.gif',
                    gender: 'male'
                }
            }
        ],
        collections:[]
    },
]