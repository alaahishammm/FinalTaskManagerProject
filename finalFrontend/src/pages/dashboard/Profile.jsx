// src/pages/dashboard/Profile.jsx (fixed version)
import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaLock, FaCheck, FaTasks } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { getCurrentUser, updateProfile } from '../../services/userService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Profile = () => {
  const { user: authUser, setUser } = useAuth();
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [statistics, setStatistics] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0
  });
  // Add a loading state specifically for the initial fetch
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // Initialize form data with current user data from context
    if (authUser) {
      setProfileData(prevData => ({
        ...prevData,
        name: authUser.name || '',
        email: authUser.email || ''
      }));
    }

    // Only fetch user profile once when component mounts
    const fetchUserProfile = async () => {
      try {
        const response = await getCurrentUser();
        const userData = response.data.user;
        
        // Update auth context with the latest user data
        // Important: this should NOT trigger another useEffect run
        setUser(prevUser => {
          // Only update if data is different to avoid cycles
          if (JSON.stringify(prevUser) !== JSON.stringify(userData)) {
            return userData;
          }
          return prevUser;
        });
        
        // Set form data
        setProfileData(prevData => ({
          ...prevData,
          name: userData.name || '',
          email: userData.email || ''
        }));
        
        // Set statistics if available in the response
        if (response.data.statistics) {
          setStatistics(response.data.statistics);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };
    
    if (isInitialLoading) {
      fetchUserProfile();
    }
    
    // Only run this effect once on component mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
    
    // Clear errors when typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    
    // Clear success message when making changes
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (profileData.name.trim() === '') {
      newErrors.name = 'Name is required';
    }
    
    if (profileData.email.trim() === '') {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation only if trying to change password
    if (profileData.password || profileData.confirmPassword || profileData.currentPassword) {
      if (!profileData.currentPassword) {
        newErrors.currentPassword = 'Current password is required to change password';
      }
      
      if (profileData.password && profileData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      
      if (profileData.password !== profileData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    setSuccessMessage('');
    
    try {
      // Prepare update data
      const updateData = {
        name: profileData.name,
        email: profileData.email
      };
      
      // Only include password fields if changing password
      if (profileData.password) {
        updateData.currentPassword = profileData.currentPassword;
        updateData.password = profileData.password;
        updateData.confirmPassword = profileData.confirmPassword;
      }
      
      // Send update request
      const response = await updateProfile(updateData);
      
      // Update auth context with updated user
      setUser(response.data.user);
      
      // Show success message
      setSuccessMessage('Profile updated successfully');
      
      // Clear password fields
      setProfileData(prevData => ({
        ...prevData,
        currentPassword: '',
        password: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('Error updating profile:', error);
      
      // Set error messages
      if (error.errors) {
        setErrors(error.errors);
      } else {
        setErrors({ 
          general: error.message || 'Failed to update profile. Please try again.' 
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>
      
      {/* Show loading state while initially fetching data */}
      {isInitialLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          {/* Profile Overview Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {authUser?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{authUser?.name}</h2>
                <p className="text-gray-600">{authUser?.email}</p>
                <p className="text-sm text-gray-500">User ID: {authUser?._id}</p>
              </div>
            </div>
          </div>
          
          {/* Statistics Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Task Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 text-gray-600 mb-2">
                  <FaTasks />
                  <span>Total Tasks</span>
                </div>
                <div className="text-2xl font-bold">{statistics.totalTasks}</div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 text-green-600 mb-2">
                  <FaCheck />
                  <span>Completed</span>
                </div>
                <div className="text-2xl font-bold text-green-700">{statistics.completedTasks}</div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 text-yellow-600 mb-2">
                  <FaTasks />
                  <span>Pending</span>
                </div>
                <div className="text-2xl font-bold text-yellow-700">{statistics.pendingTasks}</div>
              </div>
            </div>
          </div>
          
          {/* Edit Profile Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Edit Profile</h2>
            
            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700">
                <div className="flex items-center">
                  <FaCheck className="mr-2" />
                  <p>{successMessage}</p>
                </div>
              </div>
            )}
            
            {errors.general && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
                <p>{errors.general}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                    <FaUser />
                    <span>Name</span>
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                    error={errors.name}
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                    <FaEnvelope />
                    <span>Email</span>
                  </label>
                  <Input disabled
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleChange}
                    error={errors.email}
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="text-md font-medium mb-3">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                      <FaLock />
                      <span>Current Password</span>
                    </label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={profileData.currentPassword}
                      onChange={handleChange}
                      error={errors.currentPassword}
                      placeholder="Enter your current password"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                      <FaLock />
                      <span>New Password</span>
                    </label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={profileData.password}
                      onChange={handleChange}
                      error={errors.password}
                      placeholder="Enter new password"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                      <FaLock />
                      <span>Confirm New Password</span>
                    </label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={profileData.confirmPassword}
                      onChange={handleChange}
                      error={errors.confirmPassword}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button
                  type="submit"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;