

import { createBrowserRouter } from "react-router-dom";
import Landing from "../pages/landing/landing";
import SignInPage from "@/pages/sign-in/sign-in";
import NotFound from "@/pages/not-found";
import DashboardLayout from "@/layout/dashboard-layout";
import Kanbanv2 from "@/pages/kanbanv2";
import Boarding from "@/pages/boarding";
const router = createBrowserRouter([
    {
        path: "/",
        element: <Landing />,
    },

    {
        path: "/signin",
        element: <SignInPage />,
    },
    {
        path: "/boarding",
        element: <Boarding />,
    },
    {
        path: "/dashboard/:id",
        element: <DashboardLayout />,
        children: [

            {
                path: "",
                // element: <Kanban />
                element: <Kanbanv2 />
            },
        ]
    },

    {
        path: "*",
        element: <NotFound />,
    },
])

export default router