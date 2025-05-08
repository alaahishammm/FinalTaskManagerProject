// src/pages/dashboard/Tasks.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaSpinner } from 'react-icons/fa';
import { getAllTasks, deleteTask } from '../../services/taskService';
import TaskItem from '../../components/features/tasks/TaskItem';
import TaskFilters from '../../components/features/tasks/TaskFilters';
import Button from '../../components/common/Button';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});

  const fetchTasks = async (filterParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllTasks(filterParams);
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(filters);
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchTasks(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    fetchTasks({});
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      // Remove the task from the state
      setTasks(prev => prev.filter(task => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Tasks</h1>
          <p className="text-gray-600">Manage your tasks and track progress</p>
        </div>
        
        <Link to="/dashboard/tasks/create">
          <Button>
            <FaPlus className="mr-2" />
            Add Task
          </Button>
        </Link>
      </div>
      
      <div className="mb-6">
        <TaskFilters 
          onFilterChange={handleFilterChange} 
          onClearFilters={handleClearFilters}
        />
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
                onClick={() => fetchTasks(filters)}
                className="mt-2 text-sm text-red-700 hover:underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-xl font-medium text-gray-800 mb-2">No tasks found</h3>
          <p className="text-gray-600 mb-6">
            {Object.keys(filters).some(key => filters[key])
              ? 'No tasks match your filters. Try adjusting your filters or clear them.'
              : 'You don\'t have any tasks yet. Create your first task to get started.'}
          </p>
          <Link to="/dashboard/tasks/create">
            <Button>
              <FaPlus className="mr-2" />
              Create Task
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map(task => (
            <Link to={`/dashboard/tasks/${task._id}`} key={task._id}>
            <TaskItem 
              key={task._id} 
              task={task} 
              onDelete={handleDeleteTask} 
            />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks;