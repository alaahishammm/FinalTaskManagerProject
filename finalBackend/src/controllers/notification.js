const asyncHandler = require('../services/asyncHandler');
const notificationRepository = require('../repositories/notification');

/**
 * Get all notifications for current user
 */
const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { unread } = req.query;
  
  // Get notifications (all or only unread)
  const notifications = await notificationRepository.findByRecipient(
    userId, 
    unread === 'true'
  );

  // Get unread count
  const unreadCount = await notificationRepository.countUnread(userId);

  res.status(200).json({
    success: true,
    count: notifications.length,
    unreadCount,
    data: { notifications }
  });
});

/**
 * Mark notification as read
 */
const markAsRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.body;
  const userId = req.user._id;
  
  const notification = await notificationRepository.findById(notificationId);
  
  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found'
    });
  }

  // Check if user is the recipient
  if (notification.recipient.toString() !== userId.toString()) {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to mark this notification as read'
    });
  }

  // Mark as read
  const updatedNotification = await notificationRepository.markAsRead(notificationId);

  res.status(200).json({
    success: true,
    message: 'Notification marked as read',
    data: { notification: updatedNotification }
  });
});

/**
 * Mark all notifications as read
 */
const markAllAsRead = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  // Mark all as read
  await notificationRepository.markAllAsRead(userId);

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read'
  });
});

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead
};