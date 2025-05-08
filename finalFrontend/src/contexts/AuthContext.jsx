// src/contexts/AuthContext.jsx (updated)
import { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser, isAuthenticated, login, logout, register } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = () => {
      if (isAuthenticated()) {
        setUser(getCurrentUser());
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      setError(null);
      const response = await login(email, password);
      setUser(response.data.user);
      return response;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  const handleRegister = async (userData) => {
    try {
      setError(null);
      const response = await register(userData);
      setUser(response.data.user);
      return response;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
    } catch (err) {
      setError(err.message || 'Logout failed');
    }
  };

  const value = {
    user,
    setUser, // Export this so profile can update the user
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;