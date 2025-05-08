// src/services/notificationService.js
import api from './api';

export const getAllNotifications = async (onlyUnread = false) => {
  try {
    const query = onlyUnread ? '?unread=true' : '';
    const response = await api.get(`/notifications${query}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to fetch notifications' };
  }
};

export const markAsRead = async (notificationId) => {
  try {
    const response = await api.patch('/notifications/read', { notificationId });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to mark notification as read' };
  }
};

export const markAllAsRead = async () => {
  try {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to mark all notifications as read' };
  }
};