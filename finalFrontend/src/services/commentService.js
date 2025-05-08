// src/services/commentService.js
import api from './api';

export const getAllComments = async (taskId) => {
  try {
    const response = await api.get(`/comments/task/${taskId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to fetch comments' };
  }
};

export const createComment = async (commentData) => {
  try {
    const response = await api.post('/comments', commentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to create comment' };
  }
};

export const updateComment = async (commentId, commentData) => {
  try {
    const response = await api.put(`/comments/${commentId}`, commentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to update comment' };
  }
};

export const deleteComment = async (commentId) => {
  try {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to delete comment' };
  }
};