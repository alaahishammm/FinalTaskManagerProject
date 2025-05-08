// src/components/layout/DashboardLayout.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useLocation } from 'react-router-dom';

const DashboardLayout = () => {
  const location = useLocation();
  
  // Map routes to titles
  const getTitleFromPath = (path) => {
    const titles = {
      '/dashboard': 'Dashboard',
      '/dashboard/tasks': 'My Tasks',
      '/dashboard/notifications': 'Notifications',
      '/dashboard/profile': 'Profile',
    };
    return titles[path] || 'Dashboard';
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={getTitleFromPath(location.pathname)} />
        
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;