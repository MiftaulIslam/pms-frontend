// src/components/protected-route.tsx
import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/pages/auth/hooks/use-auth";

interface ProtectedRouteProps {
    children: JSX.Element;
    requireOnboarding?: boolean;
}

export const ProtectedRoute = ({ children, requireOnboarding = false }: ProtectedRouteProps) => {
    const accessToken = localStorage.getItem("access_token");
    const exp = localStorage.getItem("access_expires");
    const { user, loading } = useAuth();
    // Show loading while checking auth
    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    // Not logged in
    if (!accessToken || !exp || !user) {
        return <Navigate to="/auth" replace />;
    }

    // Token expired
    const isExpired = Date.now() / 1000 > Number(exp);
    if (isExpired) {
        localStorage.clear();
        return <Navigate to="/auth" replace />;
    }

    // Check onboarding status
    if (requireOnboarding && !user.onboarded) {
        return <Navigate to="/boarding" replace />;
    }

    return children;
};
