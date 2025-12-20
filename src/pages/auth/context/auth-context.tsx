import { createContext, useEffect, useState, type ReactNode } from "react";
import type { User, AuthContextType } from "../../../types/auth";

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);       // user object from /users/me
    const [loading, setLoading] = useState<boolean>(true); // initial app loading

    // Fetch /users/me on page refresh OR initial load
    const fetchCurrentUser = async (): Promise<void> => {
        const accessToken = localStorage.getItem("access_token");
        
        if (!accessToken) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_API}/users/me`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!res.ok) throw new Error("Unauthorized");

            const data: User = await res.json();
            setUser(data);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, fetchCurrentUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };
