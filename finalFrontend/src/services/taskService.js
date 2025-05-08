// src/services/taskService.js - Remove references to assigned_to_user where applicable
import api from './api';

export const getAllTasks = async (filters = {}) => {
  try {
    // Convert filters to query parameters
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.priority) queryParams.append('priority', filters.priority);
    if (filters.due_date_start) queryParams.append('due_date_start', filters.due_date_start);
    if (filters.due_date_end) queryParams.append('due_date_end', filters.due_date_end);
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const response = await api.get(`/tasks${query}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to fetch tasks' };
  }
};

export const getTaskById = async (taskId) => {
  try {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to fetch task' };
  }
};

export const createTask = async (taskData) => {
  try {
    const response = await api.post('/tasks', taskData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to create task' };
  }
};

export const updateTask = async (taskId, taskData) => {
  try {
    console.log('Updating task:', taskId, 'with data:', taskData);
    const response = await api.put(`/tasks/${taskId}`, taskData);
    console.log('Update task response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error.response?.data || { success: false, message: 'Failed to update task' };
  }
};

export const deleteTask = async (taskId) => {
  try {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to delete task' };
  }
};

export const uploadTaskAttachment = async (taskId, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(`/tasks/${taskId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to upload attachment' };
  }
};

export const deleteTaskAttachment = async (taskId, publicId) => {
  try {
    const response = await api.post(`/tasks/${taskId}/attachments/delete`, { public_id: publicId });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to delete attachment' };
  }
};