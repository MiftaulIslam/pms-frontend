import axios from "axios";

export const BOARDING_API = {
    COMPLETE_BOARDING: `${import.meta.env.VITE_BACKEND_API}/users/boarding/complete`,
};

export interface CompleteBoardingPayload {
    name?: string;
    heardAboutUs?: string;
    interestIn?: string[];
    avatar?: string; // Image URL or ID
}

export const completeBoarding = async (payload: CompleteBoardingPayload) => {
    const accessToken = localStorage.getItem("access_token");
    
    const response = await axios.post(BOARDING_API.COMPLETE_BOARDING, payload, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
    });
    return response.data;
};