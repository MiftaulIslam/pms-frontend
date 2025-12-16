import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

/**
 * Creates a configured axios instance with interceptors
 * Follows SOLID principles - Single Responsibility: handles HTTP client configuration
 */
class AxiosInstanceFactory {
    private static instance: AxiosInstance | null = null;

    /**
     * Creates or returns the singleton axios instance
     * Ensures consistent configuration across the application
     */
    static create(): AxiosInstance {
        if (this.instance) {
            return this.instance;
        }

        const baseURL = import.meta.env.VITE_BACKEND_API;
        if (!baseURL) {
            throw new Error('VITE_BACKEND_API environment variable is not set');
        }

        this.instance = axios.create({
            baseURL,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor - adds auth token to all requests
        this.instance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                const accessToken = localStorage.getItem('access_token');
                if (accessToken && config.headers) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor - handles token refresh on 401
        this.instance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                // If error is 401 and we haven't already retried
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    const refreshToken = localStorage.getItem('refresh_token');
                    if (!refreshToken) {
                        return Promise.reject(error);
                    }

                    try {
                        const { data } = await axios.post(`${baseURL}/auth/refresh`, {
                            refreshToken,
                        });

                        localStorage.setItem('access_token', data.accessToken);

                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                        }

                        return this.instance!(originalRequest);
                    } catch (refreshError) {
                        // Refresh failed, clear tokens and reject
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                        return Promise.reject(refreshError);
                    }
                }

                return Promise.reject(error);
            }
        );

        return this.instance;
    }
}

export const apiClient = AxiosInstanceFactory.create();

