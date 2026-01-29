// src/services/api.ts
import axios from 'axios';

// Create a standalone axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Points to your Node Backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Runs before every request
api.interceptors.request.use(
  (config) => {
    // 1. Get the user object from local storage (Key must match AuthContext)
    const userStr = localStorage.getItem('user');
    
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // 2. Extract token from the user object
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (error) {
        console.error("Error parsing user token:", error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Response Interceptor to handle 401s (Session Expiry)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Logic to redirect to login if token expires could go here
      console.error("Unauthorized access - check token.");
    }
    return Promise.reject(error);
  }
);

export default api;