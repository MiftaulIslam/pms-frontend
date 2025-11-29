import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:9000",
    withCredentials: true,
});

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        if (error.response?.status === 401) {
            const refreshToken = localStorage.getItem("refresh_token");
            if (!refreshToken) return Promise.reject(error);

            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_API}/auth/refresh`, {
                refreshToken,
            });

            localStorage.setItem("access_token", data.accessToken);
            error.config.headers["Authorization"] = `Bearer ${data.accessToken}`;
            return api(error.config);
        }
        return Promise.reject(error);
    }
);

export default api;