// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:3005/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;