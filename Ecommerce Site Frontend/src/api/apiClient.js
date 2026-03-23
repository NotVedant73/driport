import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1",
    timeout: 10000,
});

// REQUEST INTERCEPTOR: Auto-attach JWT token to every request
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("driport_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// RESPONSE INTERCEPTOR: Auto-logout on 401 Unauthorized
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Clear all auth data
            localStorage.removeItem("driport_token");
            localStorage.removeItem("driport_role");
            localStorage.removeItem("driport_email");

            // Only redirect if not already on login/register pages
            const currentPath = window.location.pathname;
            if (!currentPath.includes("/login") && !currentPath.includes("/register")) {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;