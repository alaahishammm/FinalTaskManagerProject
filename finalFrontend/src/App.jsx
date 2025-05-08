// src/App.jsx (updated routes)
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/dashboard/Dashboard';
import Tasks from './pages/dashboard/Tasks';
import CreateTask from './pages/dashboard/CreateTask';
import EditTask from './pages/dashboard/EditTask';
import TaskDetail from './pages/dashboard/TaskDetail';
import Notifications from './pages/dashboard/Notifications';
import Profile from './pages/dashboard/Profile';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Public route - redirects to dashboard if already logged in
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />
      
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="tasks/create" element={<CreateTask />} />
        <Route path="tasks/edit/:id" element={<EditTask />} />
        <Route path="tasks/:id" element={<TaskDetail />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} /> {/* Add the profile route */}
      </Route>
      
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;