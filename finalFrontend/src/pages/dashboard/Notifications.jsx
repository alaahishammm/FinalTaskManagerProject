// src/pages/dashboard/Notifications.jsx (continued)
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSpinner, FaRegBell, FaBell, FaCheckDouble } from 'react-icons/fa';
import { getAllNotifications, markAsRead, markAllAsRead } from '../../services/notificationService';
import Button from '../../components/common/Button';

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const [isMarking, setIsMarking] = useState(false);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      return `Today at ${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  const handleMarkAsRead = async () => {
    if (notification.is_read) return;
    
    setIsMarking(true);
    try {
      await onMarkAsRead(notification._id);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    } finally {
      setIsMarking(false);
    }
  };
  
  // Determine if notification has a task link
  const hasTaskLink = notification.task_id && notification.task_id._id;

  return (
    <div 
      className={`p-4 border-b ${notification.is_read ? 'bg-white' : 'bg-blue-50'}`}
      onClick={handleMarkAsRead}
    >
      <div className="flex">
        <div className="flex-shrink-0 pt-0.5">
          {notification.is_read ? (
            <FaRegBell className="text-gray-400" />
          ) : (
            <FaBell className="text-primary-600" />
          )}
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-gray-900">
            {notification.message}
          </p>
          <div className="mt-1 flex justify-between">
            <p className="text-xs text-gray-500">
              {formatDate(notification.created_at)}
            </p>
            {hasTaskLink && (
              <Link 
                to={`/dashboard/tasks/${notification.task_id._id}`}
                className="text-xs text-primary-600 hover:text-primary-700"
                onClick={(e) => e.stopPropagation()}
              >
                View Task
              </Link>
            )}
          </div>
        </div>
        {!notification.is_read && isMarking && (
          <div className="flex-shrink-0">
            <FaSpinner className="animate-spin text-primary-600" />
          </div>
        )}
      </div>
    </div>
  );
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllNotifications();
      setNotifications(response.data.notifications);
      setUnreadCount(response.unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to load notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      // Update the notification in the state
      setNotifications(prev => 
        prev.map(n => 
          n._id === notificationId ? { ...n, is_read: true } : n
        )
      );
      // Decrement unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    
    setIsMarkingAll(true);
    try {
      await markAllAsRead();
      // Update all notifications in the state
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
      // Reset unread count
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    } finally {
      setIsMarkingAll(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-gray-600">
            Stay updated with your tasks and activities
          </p>
        </div>
        
        {unreadCount > 0 && (
          <Button
            onClick={handleMarkAllAsRead}
            disabled={isMarkingAll}
            isLoading={isMarkingAll}
          >
            <FaCheckDouble className="mr-2" />
            Mark All as Read
          </Button>
        )}
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <FaSpinner className="animate-spin text-3xl text-primary-600" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={fetchNotifications}
                className="mt-2 text-sm text-red-700 hover:underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="inline-block p-3 rounded-full bg-gray-100 mb-4">
            <FaRegBell className="text-3xl text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">No notifications</h3>
          <p className="text-gray-600">
            You're all caught up! We'll notify you when there's activity on your tasks.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Recent Notifications</h2>
              {unreadCount > 0 && (
                <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {notifications.map(notification => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;