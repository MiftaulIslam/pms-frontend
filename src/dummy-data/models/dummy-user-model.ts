import type { dummyUserInterface } from "../interfaces/dummy-user-interface";

export const dummyUser: dummyUserInterface = {
    id: '3f29b8a2-6c1d-4d9b-bf4c-9a2f1d5c7e3a',
    new: true,
    profile: {
        name: 'John Doe',
        email: 'EMAIL',
        phone: '1234567890',
        address: '123 Main St',
        image: 'https://biographybd.com/wp-content/uploads/2015/11/Anisur-Rahman-Milon.gif',
        gender: 'male'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
}