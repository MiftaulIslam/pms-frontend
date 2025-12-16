

import { createBrowserRouter } from "react-router-dom";
import Landing from "../pages/landing/landing";
import NotFound from "@/pages/not-found";
import DashboardLayout from "@/layout/dashboard-layout";
import Kanbanv2 from "@/pages/kanbanv2";
import Boarding from "@/pages/boarding";
import AuthPage from "@/pages/auth/auth";
import OAuthSuccess from "@/pages/auth/auth-callback";
import { ProtectedRoute } from "@/components/protected-route";
const router = createBrowserRouter([
    {
        path: "/",
        element: <Landing />,
    },
    {
        path: "/auth",
        element: <AuthPage />,
    },
    {
        path: "/auth/success",
        element: <OAuthSuccess />,
    },
    {
        path: "/boarding",
        element: <ProtectedRoute><Boarding /></ProtectedRoute>,
    },
    {
        path: "/dashboard",
        element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
        children: [
            {
                path: "",
                // element: <Kanban />
                element: <Kanbanv2 />
            },
            {
                path: "list/:id",
                element: <Kanbanv2 />
            },
            {
                path: "doc/:id",
                // TODO: Add document component when ready
                element: <div>Document view - Coming soon</div>
            },
            {
                path: "whiteboard/:id",
                // TODO: Add whiteboard component when ready
                element: <div>Whiteboard view - Coming soon</div>
            },
        ]
    },

    {
        path: "*",
        element: <NotFound />,
    },
])

export default router