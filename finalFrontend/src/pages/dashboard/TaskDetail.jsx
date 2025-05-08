// src/pages/dashboard/TaskDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaSpinner, FaArrowLeft, FaUser, FaUsers, FaCalendarAlt, FaRegClock } from 'react-icons/fa';
import { 
  getTaskById, 
  deleteTask, 
  uploadTaskAttachment, 
  deleteTaskAttachment 
} from '../../services/taskService';
import { getAllSubtasks, createSubtask, toggleSubtaskCompletion, deleteSubtask } from '../../services/subtaskService';
import { getAllComments, createComment, deleteComment } from '../../services/commentService';
import { useAuth } from '../../contexts/AuthContext';
import SubtaskList from '../../components/features/tasks/SubtaskList';
import CommentList from '../../components/features/tasks/CommentList';
import TaskAttachments from '../../components/features/tasks/TaskAttachments';
import Button from '../../components/common/Button';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [task, setTask] = useState(null);
  const [subtasks, setSubtasks] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        // Fetch task details
        const taskResponse = await getTaskById(id);
        setTask(taskResponse.data.task);
        
        // Fetch subtasks separately
        const subtasksResponse = await getAllSubtasks(id);
        setSubtasks(subtasksResponse.data.subtasks);
        
        // Fetch comments
        const commentsResponse = await getAllComments(id);
        setComments(commentsResponse.data.comments);
      } catch (error) {
        console.error('Error fetching task data:', error);
        setError('Failed to load task details. It may have been deleted or you don\'t have permission to view it.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchTaskData();
  }, [id]);

  const handleDeleteTask = async () => {
    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        await deleteTask(id);
        navigate('/dashboard/tasks');
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task. Please try again.');
        setIsDeleting(false);
      }
    }
  };

  const handleAddSubtask = async (subtaskData) => {
    const response = await createSubtask(subtaskData);
    setSubtasks([...subtasks, response.data.subtask]);
    return response;
  };

  const handleToggleSubtask = async (subtaskId) => {
    const response = await toggleSubtaskCompletion(subtaskId);
    setSubtasks(subtasks.map(s => 
      s._id === subtaskId ? response.data.subtask : s
    ));
    return response;
  };

  const handleDeleteSubtask = async (subtaskId) => {
    await deleteSubtask(subtaskId);
    setSubtasks(subtasks.filter(s => s._id !== subtaskId));
  };

  const handleAddComment = async (commentData) => {
    const response = await createComment(commentData);
    setComments([response.data.comment, ...comments]);
    return response;
  };

  const handleDeleteComment = async (commentId) => {
    await deleteComment(commentId);
    setComments(comments.filter(c => c._id !== commentId));
  };

  // Handle attachment functions
  const handleAttachmentAdded = (newAttachment) => {
    setTask({
      ...task,
      attachments: [...(task.attachments || []), newAttachment]
    });
  };

  const handleAttachmentDeleted = (publicId) => {
    setTask({
      ...task,
      attachments: (task.attachments || []).filter(
        attachment => attachment.public_id !== publicId
      )
    });
  };

  // Check if the current user is the creator of the task
  const isCreator = () => {
    if (!user || !task || !task.created_by_user) return false;
    return user._id === (typeof task.created_by_user === 'string' ? task.created_by_user : task.created_by_user._id);
  };

  // Helper to safely get user name
  const getUserName = (user) => {
    if (!user) return 'Unknown';
    if (typeof user === 'string') return 'User';
    return user.name || 'Unknown';
  };

  // Render assigned users
  const renderAssignedUsers = () => {
    if (!task.assigned_to_users || task.assigned_to_users.length === 0) {
      return (
        <div className="flex items-center mb-4">
          <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs">
            <FaUser />
          </div>
          <span className="ml-2 text-gray-600">No users assigned</span>
        </div>
      );
    } else if (task.assigned_to_users.length === 1) {
      const user = task.assigned_to_users[0];
      return (
        <div className="flex items-center mb-4">
          <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs">
            {getUserName(user).charAt(0).toUpperCase()}
          </div>
          <span className="ml-2 text-gray-900">
            {getUserName(user)}
          </span>
        </div>
      );
    } else {
      return (
        <div className="space-y-2 mb-4">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs">
              <FaUsers />
            </div>
            <span className="ml-2 text-gray-900">
              {task.assigned_to_users.length} assigned users
            </span>
          </div>
          <div className="pl-8">
            <ul className="text-sm text-gray-600 space-y-1">
              {task.assigned_to_users.map(user => (
                <li key={typeof user === 'string' ? user : user._id}>
                  • {getUserName(user)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }
  };

  // Get priority badge class
  const getPriorityClass = (priority) => {
    const classes = {
      High: 'bg-red-100 text-red-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      Low: 'bg-green-100 text-green-800',
    };
    return classes[priority] || classes.Medium;
  };

  // Get status badge class
  const getStatusClass = (status) => {
    const classes = {
      'To Do': 'bg-gray-100 text-gray-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Done': 'bg-green-100 text-green-800',
    };
    return classes[status] || classes['To Do'];
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <FaSpinner className="animate-spin text-3xl text-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex flex-col">
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={() => navigate('/dashboard/tasks')}
            className="mt-4 text-sm text-primary-600 hover:underline"
          >
            Return to Tasks
          </button>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
        <div className="flex flex-col">
          <p className="text-sm text-yellow-700">Task not found</p>
          <button
            onClick={() => navigate('/dashboard/tasks')}
            className="mt-4 text-sm text-primary-600 hover:underline"
          >
            Return to Tasks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Task Header */}
      <div className="flex items-center mb-6">
        <Link 
          to="/dashboard/tasks" 
          className="flex items-center text-primary-600 hover:text-primary-700 mr-4"
        >
          <FaArrowLeft className="mr-1" /> Back to Tasks
        </Link>
        
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{task.title}</h1>
        </div>
        
        {/* Only show edit and delete buttons if the current user is the creator */}
        {isCreator() && (
          <div className="flex space-x-2">
            <Link to={`/dashboard/tasks/edit/${task._id}`}>
              <Button>
                <FaEdit className="mr-2" /> Edit
              </Button>
            </Link>
            
            <Button 
              variant="danger" 
              onClick={handleDeleteTask}
              isLoading={isDeleting}
              disabled={isDeleting}
            >
              <FaTrash className="mr-2" /> Delete
            </Button>
          </div>
        )}
      </div>
      
      {/* Task Details */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                <p className="text-gray-900">
                  {task.description || "No description provided"}
                </p>
              </div>
              
              <div className="flex items-center mb-4">
                <div className="mr-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Due Date</h3>
                  <div className="flex items-center text-gray-900">
                    <FaCalendarAlt className="mr-2 text-gray-400" />
                    {formatDate(task.due_date)}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                  <span className={`px-2 py-1 rounded-full text-sm ${getStatusClass(task.status)}`}>
                    {task.status}
                  </span>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Priority</h3>
                <span className={`px-2 py-1 rounded-full text-sm ${getPriorityClass(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
              
              {task.isRecurring && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Recurrence</h3>
                  <div className="flex items-center text-gray-900">
                    <FaRegClock className="mr-2 text-gray-400" />
                    {task.recurrencePattern.charAt(0).toUpperCase() + task.recurrencePattern.slice(1)}
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Assigned Users</h3>
                {renderAssignedUsers()}
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Created By</h3>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center text-white text-xs">
                    {task.created_by_user ? 
                      getUserName(task.created_by_user).charAt(0).toUpperCase() : '?'}
                  </div>
                  <span className="ml-2 text-gray-900">
                    {task.created_by_user ? getUserName(task.created_by_user) : 'Unknown'}
                  </span>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Created At</h3>
                <p className="text-gray-900">
                  {task.createdAt ? formatDate(task.createdAt) : 'Unknown'}
                </p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Last Updated</h3>
                <p className="text-gray-900">
                  {task.updatedAt ? formatDate(task.updatedAt) : 'Unknown'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Attachments */}
      <div className="bg-white rounded-lg shadow mb-6 p-6">
        <TaskAttachments
          taskId={task._id}
          attachments={task.attachments || []}
          onAttachmentAdded={handleAttachmentAdded}
          onAttachmentDeleted={handleAttachmentDeleted}
        />
      </div>
      
      {/* Subtasks */}
      <div className="bg-white rounded-lg shadow mb-6 p-6">
        <SubtaskList
          taskId={task._id}
          subtasks={subtasks}
          onAddSubtask={handleAddSubtask}
          onToggleSubtask={handleToggleSubtask}
          onDeleteSubtask={handleDeleteSubtask}
        />
      </div>

      {/* Comments */}
      <div className="bg-white rounded-lg shadow p-6">
        <CommentList
          taskId={task._id}
          comments={comments}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
        />
      </div>
    </div>
  );
};

export default TaskDetail;