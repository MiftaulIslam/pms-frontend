import axios from "axios";

export const BOARDING_API = {
    COMPLETE_BOARDING: `${import.meta.env.VITE_BACKEND_API}/users/boarding/complete`,
};

export const completeBoarding = async (formData: FormData) => {
    const accessToken = localStorage.getItem("access_token");
    
    const response = await axios.post(BOARDING_API.COMPLETE_BOARDING, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${accessToken}`,
        },
    });
    return response.data;
};