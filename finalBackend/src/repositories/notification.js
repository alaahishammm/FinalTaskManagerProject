const Notification = require('../../DB/models/notification');

/**
 * Notification Repository - Handles database operations for notifications
 */
class NotificationRepository {
  /**
   * Create a new notification
   * @param {Object} notificationData - Notification data
   * @returns {Promise<Notification>} - Created notification
   */
  async createNotification(notificationData) {
    return await Notification.create(notificationData);
  }

  /**
   * Find notification by ID
   * @param {String} notificationId - Notification ID
   * @returns {Promise<Notification>} - Found notification
   */
  async findById(notificationId) {
    return await Notification.findById(notificationId);
  }

  /**
   * Find notifications by recipient
   * @param {String} userId - User ID (recipient)
   * @param {Boolean} onlyUnread - Whether to return only unread notifications
   * @returns {Promise<Array<Notification>>} - Found notifications
   */
  async findByRecipient(userId, onlyUnread = false) {
    const query = { recipient: userId };
    
    if (onlyUnread) {
      query.is_read = false;
    }
    
    return await Notification.find(query)
      .populate('task_id', 'title')
      .sort({ created_at: -1 });
  }

  /**
   * Mark notification as read
   * @param {String} notificationId - Notification ID
   * @returns {Promise<Notification>} - Updated notification
   */
  async markAsRead(notificationId) {
    return await Notification.findByIdAndUpdate(
      notificationId,
      { is_read: true },
      { new: true }
    );
  }

  /**
   * Mark all notifications as read for a user
   * @param {String} userId - User ID
   * @returns {Promise<Object>} - Update result
   */
  async markAllAsRead(userId) {
    return await Notification.updateMany(
      { recipient: userId, is_read: false },
      { is_read: true }
    );
  }

  /**
   * Delete notification
   * @param {String} notificationId - Notification ID
   * @returns {Promise<Notification>} - Deleted notification
   */
  async deleteNotification(notificationId) {
    return await Notification.findByIdAndDelete(notificationId);
  }

  /**
   * Count unread notifications for a user
   * @param {String} userId - User ID
   * @returns {Promise<Number>} - Count of unread notifications
   */
  async countUnread(userId) {
    return await Notification.countDocuments({
      recipient: userId,
      is_read: false
    });
  }
}

module.exports = new NotificationRepository();