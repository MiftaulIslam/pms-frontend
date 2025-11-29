import { useAuth } from "@/pages/auth/context/use-auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthSuccess() {
    const navigate = useNavigate();
    const { fetchCurrentUser } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        const accessToken = params.get("accessToken");
        const refreshToken = params.get("refreshToken");
        const accessExpires = params.get("accessExpires");
        const refreshExpires = params.get("refreshExpires");
        const nextStep = params.get("nextStep");

        console.log({
            accessToken,
            refreshToken,
            accessExpires,
            refreshExpires,
            nextStep,
        })
        if (accessToken && refreshToken && accessExpires && refreshExpires && nextStep) {
            localStorage.setItem("access_token", accessToken);
            localStorage.setItem("refresh_token", refreshToken);
            localStorage.setItem("refresh_expires", refreshExpires);
            localStorage.setItem("access_expires", accessExpires);

            // Fetch user and populate context
            fetchCurrentUser();
            console.log("checking next step", nextStep == "boarding")
            if (nextStep == "boarding") {
                navigate("/boarding");
            } else {
                navigate("/dashboard");
            }
        }
    }, [navigate]);

    return <div>Signing you in...</div>;
}