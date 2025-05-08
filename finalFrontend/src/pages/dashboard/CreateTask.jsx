// src/pages/dashboard/CreateTask.jsx
import { createTask } from '../../services/taskService';
import TaskForm from '../../components/features/tasks/TaskForm';

const CreateTask = () => {
  const handleSubmit = async (taskData) => {
    return await createTask(taskData);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New Task</h1>
        <p className="text-gray-600">Create a new task to track your work</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <TaskForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default CreateTask;