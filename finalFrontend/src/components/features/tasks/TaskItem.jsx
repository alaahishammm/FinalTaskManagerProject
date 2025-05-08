// src/components/features/tasks/TaskItem.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaCalendarAlt, FaRegClock, FaUser, FaUsers } from 'react-icons/fa';
import { useAuth } from '../../../contexts/AuthContext'; // Import useAuth

const TaskItem = ({ task, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth(); // Get current user
  
  const getPriorityClass = (priority) => {
    const classes = {
      High: 'bg-red-100 text-red-800 border-red-200',
      Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Low: 'bg-green-100 text-green-800 border-green-200',
    };
    return classes[priority] || classes.Medium;
  };

  const getStatusClass = (status) => {
    const classes = {
      'To Do': 'bg-gray-100 text-gray-800 border-gray-200',
      'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
      'Done': 'bg-green-100 text-green-800 border-green-200',
    };
    return classes[status] || classes['To Do'];
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      try {
        await onDelete(task._id);
      } catch (error) {
        console.error('Error deleting task:', error);
        setIsDeleting(false);
      }
    }
  };

  // Helper to safely get user name
  const getUserName = (user) => {
    if (!user) return 'Unknown';
    if (typeof user === 'string') return 'User';
    return user.name || 'Unknown';
  };

  // Check if current user is the creator of the task
  const isCreator = () => {
    if (!user || !task.created_by_user) return false;
    
    const creatorId = typeof task.created_by_user === 'string' 
      ? task.created_by_user 
      : task.created_by_user._id;
      
    return user._id === creatorId;
  };

  // Get assignees to display
  const getAssigneeDisplay = () => {
    if (!task.assigned_to_users || task.assigned_to_users.length === 0) {
      return (
        <div className="flex items-center ml-2">
          <div className="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs">
            <FaUser size={10} />
          </div>
          <span className="ml-1 text-xs text-gray-600">Unassigned</span>
        </div>
      );
    } else if (task.assigned_to_users.length === 1) {
      const user = task.assigned_to_users[0];
      return (
        <div className="flex items-center ml-2">
          <div className="w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs">
            {getUserName(user).charAt(0).toUpperCase()}
          </div>
          <span className="ml-1 text-xs text-gray-600">
            {getUserName(user)}
          </span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center ml-2">
          <div className="w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs">
            <FaUsers size={10} />
          </div>
          <span className="ml-1 text-xs text-gray-600">
            {task.assigned_to_users.length} assignees
          </span>
        </div>
      );
    }
  };

  // Get creator display
  const getCreatorDisplay = () => {
    if (!task.created_by_user) {
      return null;
    }
    
    return (
      <div className="flex items-center ml-2">
        <div className="w-5 h-5 rounded-full bg-gray-500 flex items-center justify-center text-white text-xs">
          {getUserName(task.created_by_user).charAt(0).toUpperCase()}
        </div>
        <span className="ml-1 text-xs text-gray-600">
          Created by: {getUserName(task.created_by_user)}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-lg">{task.title}</h3>
          {task.description && (
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{task.description}</p>
          )}
        </div>
        
        {/* Only show edit and delete buttons if the current user is the creator */}
        {isCreator() && (
          <div className="flex space-x-2">
            <Link 
              to={`/dashboard/tasks/edit/${task._id}`}
              className="p-1.5 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded"
              onClick={(e) => e.stopPropagation()}
            >
              <FaEdit />
            </Link>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              disabled={isDeleting}
              className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded disabled:opacity-50"
            >
              {isDeleting ? (
                <div className="w-4 h-4 border-2 border-t-transparent border-red-600 rounded-full animate-spin"></div>
              ) : (
                <FaTrash />
              )}
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-4 flex items-center text-sm text-gray-500">
        <div className="flex items-center mr-4">
          <FaCalendarAlt className="mr-1" />
          <span>Due: {formatDate(task.due_date)}</span>
        </div>
        
        {task.isRecurring && (
          <div className="flex items-center mr-4">
            <FaRegClock className="mr-1" />
            <span>Recurring: {task.recurrencePattern}</span>
          </div>
        )}
      </div>
      
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(task.status)}`}>
          {task.status}
        </span>
        
        <span className={`px-2 py-1 rounded-full text-xs ${getPriorityClass(task.priority)}`}>
          {task.priority}
        </span>
        
        {/* Display assignees */}
        {getAssigneeDisplay()}
        
        {/* Display creator */}
        {getCreatorDisplay()}
      </div>
    </div>
  );
};

export default TaskItem;