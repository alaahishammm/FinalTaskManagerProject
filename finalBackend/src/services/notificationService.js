const Notification = require('../../DB/models/notification');
const Task = require('../../DB/models/task');
const User = require('../../DB/models/user');

/**
 * Create a new notification
 * @param {Object} notificationData - Data for the notification
 * @returns {Promise<Notification>} - Created notification
 */
const createNotification = async (notificationData) => {
  return await Notification.create(notificationData);
};

/**
 * Notify user when assigned to a task
 * @param {String} taskId - ID of the task
 * @param {String} assignedUserId - ID of the user assigned
 * @param {String} assignerUserId - ID of the user who assigned the task
 */
const notifyTaskAssignment = async (taskId, assignedUserId, assignerUserId) => {
  const task = await Task.findById(taskId);
  const assigner = await User.findById(assignerUserId);

  if (!task || !assigner) {
    return;
  }

  const message = `${assigner.name} assigned you to task: ${task.title}`;

  await createNotification({
    message,
    recipient: assignedUserId,
    task_id: taskId,
    is_read: false
  });
};

// src/services/notificationService.js - Fix for notifyTaskComment function

/**
 * Notify all users with access to a task when a comment is added
 * @param {String} taskId - ID of the task
 * @param {String} commenterId - ID of the user who commented
 * @param {String} commentContent - Content of the comment (truncated for notification)
 */
const notifyTaskComment = async (taskId, commenterId, commentContent) => {
  const task = await Task.findById(taskId);
  const commenter = await User.findById(commenterId);

  if (!task || !commenter) {
    return;
  }

  // Get shortened comment content for notification
  const shortContent = commentContent.length > 30 
    ? `${commentContent.substring(0, 30)}...` 
    : commentContent;

  const message = `${commenter.name} commented on task "${task.title}": ${shortContent}`;

  // Users with access to the task (creator and assigned users)
  let usersToNotify = [];
  
  // Add creator if exists
  if (task.created_by_user && task.created_by_user.toString() !== commenterId.toString()) {
    usersToNotify.push(task.created_by_user);
  }
  
  // Add assigned users if they exist
  if (task.assigned_to_users && Array.isArray(task.assigned_to_users) && task.assigned_to_users.length > 0) {
    // Filter out the commenter from assigned users
    const assignedUsers = task.assigned_to_users.filter(userId => 
      userId && userId.toString() !== commenterId.toString()
    );
    
    usersToNotify = [...usersToNotify, ...assignedUsers];
  }
  
  // Remove duplicates
  usersToNotify = [...new Set(usersToNotify)];

  // Create notifications for each user
  const notificationPromises = usersToNotify.map(userId => 
    createNotification({
      message,
      recipient: userId,
      task_id: taskId,
      is_read: false
    })
  );

  await Promise.all(notificationPromises);
};

/**
 * Mark a notification as read
 * @param {String} notificationId - ID of the notification
 * @param {String} userId - ID of the user marking as read
 */
const markNotificationAsRead = async (notificationId, userId) => {
  const notification = await Notification.findById(notificationId);
  
  if (!notification || notification.recipient.toString() !== userId.toString()) {
    throw new Error('Notification not found or access denied');
  }

  notification.is_read = true;
  await notification.save();
  
  return notification;
};

module.exports = {
  createNotification,
  notifyTaskAssignment,
  notifyTaskComment,
  markNotificationAsRead
};