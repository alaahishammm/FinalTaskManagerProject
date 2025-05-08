// src/services/userService.js (updated)
import api from './api';

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/users/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to fetch profile' };
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to update profile' };
  }
};

export const searchUserByEmail = async (email) => {
  try {
    const response = await api.get(`/users/search?email=${encodeURIComponent(email)}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to find user' };
  }
};

// src/services/userService.js (add this function)
export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to fetch user details' };
  }
};