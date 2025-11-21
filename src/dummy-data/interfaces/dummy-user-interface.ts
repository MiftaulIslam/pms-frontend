
export interface dummyUserInterface {
    id: string
    new?: boolean
    profile: {
        name: string
        email: string
        phone: string
        address: string
        image: string
        gender: "male" | "female"
    }
    createdAt?: string
    updatedAt?: string
}