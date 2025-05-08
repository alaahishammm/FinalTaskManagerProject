// src/services/authService.js
import api from './api';

export const login = async (email, password) => {
  try {
    const response = await api.post('/users/login', { email, password });
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Login failed' };
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/users/register', userData);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Registration failed' };
  }
};

export const logout = async () => {
  try {
    await api.post('/users/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: true };
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Logout failed' };
  }
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};