// src/components/features/tasks/TaskForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../common/Button';
import Input from '../../common/Input';
import UserSearch from '../../common/UserSearch';

const TaskForm = ({ initialData = {}, onSubmit, isEditing = false }) => {
  const defaultFormData = {
    title: '',
    description: '',
    due_date: '',
    priority: 'Medium',
    status: 'To Do',
    assigned_to_users: [],
    isRecurring: false,
    recurrencePattern: '',
  };

  const [formData, setFormData] = useState({ ...defaultFormData, ...initialData });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [showUserSearch, setShowUserSearch] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Format the due date for the input field
    if (initialData.due_date) {
      const dueDate = new Date(initialData.due_date);
      const formattedDate = dueDate.toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, due_date: formattedDate }));
    }
    
    // Handle when editing an existing task
    if (isEditing) {
      let initialUsers = [];
      
      // Process assigned_to_users from initialData
      if (initialData.assigned_to_users && Array.isArray(initialData.assigned_to_users)) {
        initialUsers = initialData.assigned_to_users.map(user => {
          // Convert to object format if it's just an ID
          if (typeof user === 'string') {
            return { _id: user, name: 'Unknown User', email: '' };
          }
          return user;
        });
      }
      
      // Set assigned users state
      setAssignedUsers(initialUsers);
      
      // Extract IDs for the form data
      const userIds = initialUsers.map(user => user._id);
      setFormData(prev => ({ 
        ...prev, 
        assigned_to_users: userIds
      }));
    }
  }, [initialData, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData({ 
      ...formData, 
      [name]: newValue 
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    
    // Special handling for recurrence pattern
    if (name === 'isRecurring' && !checked) {
      setFormData(prev => ({ ...prev, recurrencePattern: '' }));
    }
  };

  const handleUserSelect = (selectedUser) => {
    // Check if the user is already in the list
    const userExists = assignedUsers.some(user => user._id === selectedUser._id);
    
    if (!userExists) {
      const updatedUsers = [...assignedUsers, selectedUser];
      setAssignedUsers(updatedUsers);
      
      // Update the form data with the IDs
      const userIds = updatedUsers.map(user => user._id);
      setFormData(prev => ({ 
        ...prev, 
        assigned_to_users: userIds
      }));
    }
    
    setShowUserSearch(false);
  };

  const handleRemoveUser = (userId) => {
    const updatedUsers = assignedUsers.filter(user => user._id !== userId);
    setAssignedUsers(updatedUsers);
    
    // Update the form data with the remaining IDs
    const userIds = updatedUsers.map(user => user._id);
    setFormData(prev => ({ 
      ...prev, 
      assigned_to_users: userIds
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    
    if (!formData.due_date) {
      newErrors.due_date = 'Due date is required';
    } else {
      const dueDate = new Date(formData.due_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        newErrors.due_date = 'Due date must be in the future';
      }
    }
    
    if (formData.isRecurring && !formData.recurrencePattern) {
      newErrors.recurrencePattern = 'Recurrence pattern is required for recurring tasks';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    setSubmitError('');
    
    try {
      // Prepare data for submission
      const dataToSubmit = {
        title: formData.title,
        description: formData.description,
        due_date: formData.due_date,
        priority: formData.priority,
        status: formData.status,
        isRecurring: formData.isRecurring,
        recurrencePattern: formData.recurrencePattern || ''
      };
      
      // Only include assigned_to_users if there are users
      if (assignedUsers.length > 0) {
        dataToSubmit.assigned_to_users = assignedUsers.map(user => user._id);
      }
      
      await onSubmit(dataToSubmit);
      navigate('/dashboard/tasks');
    } catch (error) {
      console.error('Error submitting task:', error);
      setSubmitError(error.message || 'Failed to save task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form content - unchanged */}
      {submitError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-sm text-red-700">{submitError}</p>
        </div>
      )}
      
      {/* Form fields - unchanged */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Input
            label="Title"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
            maxLength={100}
          />
        </div>
        
        <div>
          <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <input
            id="due_date"
            name="due_date"
            type="date"
            value={formData.due_date}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${
              errors.due_date ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
            required
          />
          {errors.due_date && <p className="mt-1 text-sm text-red-600">{errors.due_date}</p>}
        </div>
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          maxLength={1000}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
      </div>
      
      {/* Assign Users Section - Modified to be clearly optional */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Assigned Users (Optional)
        </label>
        
        <div className="mb-2">
          {assignedUsers.length > 0 ? (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {assignedUsers.map(user => (
                  <div 
                    key={user._id}
                    className="flex items-center bg-gray-100 rounded-full pl-2 pr-1 py-1"
                  >
                    <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs mr-1">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="text-sm mr-1">{user.name || 'Unknown'}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveUser(user._id)}
                      className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-300"
                    >
                      <FaTimes size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500 mb-2">
              No users assigned. Task will be created by you without specific assignees.
            </div>
          )}
          
          {errors.assigned_to_users && (
            <p className="mt-1 text-sm text-red-600">{errors.assigned_to_users}</p>
          )}
          
          {showUserSearch ? (
            <div className="mt-3">
              <UserSearch
                onSelect={handleUserSelect}
                placeholder="Search for users by email..."
              />
              <Button
                type="button"
                variant="secondary"
                className="mt-2"
                onClick={() => setShowUserSearch(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowUserSearch(true)}
            >
              <FaUserPlus className="mr-2" /> Add User
            </Button>
          )}
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center mb-4">
          <input
            id="isRecurring"
            name="isRecurring"
            type="checkbox"
            checked={formData.isRecurring}
            onChange={handleChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="isRecurring" className="ml-2 block text-sm text-gray-700">
            This is a recurring task
          </label>
        </div>
        
        {formData.isRecurring && (
          <div>
            <label htmlFor="recurrencePattern" className="block text-sm font-medium text-gray-700 mb-1">
              Recurrence Pattern
            </label>
            <select
              id="recurrencePattern"
              name="recurrencePattern"
              value={formData.recurrencePattern}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.recurrencePattern ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
            >
              <option value="">Select Recurrence Pattern</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            {errors.recurrencePattern && (
              <p className="mt-1 text-sm text-red-600">{errors.recurrencePattern}</p>
            )}
          </div>
        )}
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate('/dashboard/tasks')}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isEditing ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;