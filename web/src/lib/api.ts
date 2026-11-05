import axios from 'axios'

// Exports an api object
// Requests go to /api, which the vite dev proxy forwards to laravel
// In production, set VITE_API_URL to the full backend url if it is hosted separately
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "/api",
    headers: { Accept: "application/json" },
})

// Adds token checking
api.interceptors.request.use((config) => {
    // Gets the token from the local storage
    const token = localStorage.getItem("token");
    
    // Checks the token bearer
    if (token) config.headers.Authorization = "Bearer " + token;
    
    // Returns the config
    return config;
});

// Handles 401
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.assign("/login");
    }
    return Promise.reject(error);
  }
);