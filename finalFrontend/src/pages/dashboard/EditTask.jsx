// src/pages/dashboard/EditTask.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import { getTaskById, updateTask } from '../../services/taskService';
import TaskForm from '../../components/features/tasks/TaskForm';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await getTaskById(id);
        setTask(response.data.task);
      } catch (error) {
        console.error('Error fetching task:', error);
        setError('Failed to load task. It may have been deleted or you don\'t have permission to view it.');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleSubmit = async (taskData) => {
    return await updateTask(id, taskData);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <FaSpinner className="animate-spin text-3xl text-primary-600" />
      </div>
    );
  }

// src/pages/dashboard/EditTask.jsx (continued)
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Task</h1>
        <p className="text-gray-600">Update task details and settings</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <TaskForm 
          initialData={task}
          onSubmit={handleSubmit}
          isEditing={true}
        />
      </div>
    </div>
  );
};

export default EditTask;