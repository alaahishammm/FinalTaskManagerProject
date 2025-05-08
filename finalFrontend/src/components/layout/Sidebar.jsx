// src/components/layout/Sidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import { 
  FaTasks, 
  FaClipboardCheck, 
  FaRegBell, 
  FaUserCircle,
  FaSignOutAlt
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: FaTasks },
  { path: '/dashboard/tasks', label: 'My Tasks', icon: FaClipboardCheck },
  { path: '/dashboard/notifications', label: 'Notifications', icon: FaRegBell },
  { path: '/dashboard/profile', label: 'Profile', icon: FaUserCircle },
];

const Sidebar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="w-64 bg-gray-800 text-white h-screen flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">Task Tracker</h1>
      </div>
      
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold">{user?.name}</div>
            <div className="text-xs text-gray-400">{user?.email}</div>
            <div className="text-xs text-gray-400">id : {user?._id}</div>
          </div>
        </div>
      </div>
      
      <nav className="mt-4 flex-1">
        <ul>
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-3 text-gray-300 hover:bg-gray-700 ${
                  location.pathname === item.path ? 'bg-gray-700 text-white' : ''
                }`}
              >
                <item.icon className="text-lg" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-gray-700 rounded"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;