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
    const token = localStorage.getItem('neuroforge_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;