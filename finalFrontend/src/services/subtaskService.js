// src/services/subtaskService.js
import api from './api';

export const getAllSubtasks = async (taskId) => {
  try {
    const response = await api.get(`/subtasks/task/${taskId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to fetch subtasks' };
  }
};

export const createSubtask = async (subtaskData) => {
  try {
    const response = await api.post('/subtasks', subtaskData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to create subtask' };
  }
};

export const updateSubtask = async (subtaskId, subtaskData) => {
  try {
    const response = await api.put(`/subtasks/${subtaskId}`, subtaskData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to update subtask' };
  }
};

export const toggleSubtaskCompletion = async (subtaskId) => {
  try {
    const response = await api.patch(`/subtasks/${subtaskId}/toggle`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to toggle subtask completion' };
  }
};

export const deleteSubtask = async (subtaskId) => {
  try {
    const response = await api.delete(`/subtasks/${subtaskId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to delete subtask' };
  }
};