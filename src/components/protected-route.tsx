// src/components/protected-route.tsx
import type { JSX } from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const accessToken = localStorage.getItem("access_token");
    const exp = localStorage.getItem("access_expires");

    // Not logged in
    if (!accessToken || !exp) {
        return <Navigate to="/auth" replace />;
    }

    // Token expired
    const isExpired = Date.now() / 1000 > Number(exp);
    if (isExpired) {
        localStorage.clear();
        return <Navigate to="/auth" replace />;
    }

    return children;
};
