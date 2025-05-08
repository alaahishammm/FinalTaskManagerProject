// src/pages/dashboard/Dashboard.jsx
import { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaCheckCircle, FaSpinner, FaClock } from 'react-icons/fa';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    todo: 0,
    highPriority: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all tasks to calculate stats
        const response = await api.get('/tasks');
        const tasks = response.data.data.tasks;
        
        // Calculate stats
        const completed = tasks.filter(task => task.status === 'Done').length;
        const inProgress = tasks.filter(task => task.status === 'In Progress').length;
        const todo = tasks.filter(task => task.status === 'To Do').length;
        const highPriority = tasks.filter(task => task.priority === 'High').length;
        
        setStats({
          total: tasks.length,
          completed,
          inProgress,
          todo,
          highPriority,
        });
        
        // Get recent tasks (up to 5)
        const recent = tasks
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setRecentTasks(recent);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <FaSpinner className="animate-spin text-3xl text-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>{error}</p>
        <button
          className="mt-2 text-primary-600 hover:underline"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stats Cards */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-500">Total Tasks</div>
          <div className="text-3xl font-bold mt-2">{stats.total}</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-500">Completed</div>
          <div className="flex items-center mt-2">
            <div className="text-3xl font-bold mr-2">{stats.completed}</div>
            <FaCheckCircle className="text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-500">In Progress</div>
          <div className="flex items-center mt-2">
            <div className="text-3xl font-bold mr-2">{stats.inProgress}</div>
            <FaSpinner className="text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-500">High Priority</div>
          <div className="flex items-center mt-2">
            <div className="text-3xl font-bold mr-2">{stats.highPriority}</div>
            <FaClock className="text-red-500" />
          </div>
        </div>
      </div>
      
      {/* Recent Tasks */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Recent Tasks</h2>
        </div>
        
        {recentTasks.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No tasks yet. Create your first task to get started.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {recentTasks.map((task) => (
              <li key={task._id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-gray-500">
                      Due: {new Date(task.due_date).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    <span 
                      className={`px-2 py-1 text-xs rounded-full ${
                        task.status === 'Done' 
                          ? 'bg-green-100 text-green-800' 
                          : task.status === 'In Progress' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {task.status}
                    </span>
                    
                    <span 
                      className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        task.priority === 'High' 
                          ? 'bg-red-100 text-red-800' 
                          : task.priority === 'Medium' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;