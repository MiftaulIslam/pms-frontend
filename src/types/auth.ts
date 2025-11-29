export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    createdAt: string;
    updatedAt: string;
    onboarded: boolean;
    heardAboutUs: string;
    interestIn: string[];
    lastWorkspaceId?: string;
}

export interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    loading: boolean;
    fetchCurrentUser: () => Promise<void>;
}
