const bcrypt = require('bcryptjs');
const asyncHandler = require('../services/asyncHandler');
const userRepository = require('../repositories/user');

/**
 * User registration
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User with this email already exists'
    });
  }

  // Create user
  const user = await userRepository.createUser({
    name,
    email,
    password
  });

  // Generate JWT
  const token = userRepository.createToken(user._id);
  
  // Save token to database for logout functionality
  await userRepository.saveToken(user._id, token);

  // Send response with token
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      },
      token
    }
  });
});

/**
 * User login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Get user with password
  const user = await userRepository.findByEmail(email, true);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Check password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Generate JWT
  const token = userRepository.createToken(user._id);
  
  // Save token to database for logout functionality
  await userRepository.saveToken(user._id, token);

  // Send response with token
  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      },
      token
    }
  });
});

/**
 * User logout
 */
const logout = asyncHandler(async (req, res) => {
  // Get token from request
  const token = req.headers.authorization.split(' ')[1];
  
  // Invalidate token
  await userRepository.invalidateToken(token);

  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
});

/**
 * Get current user profile
 */
const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user
    }
  });
});

/**
 * Update user profile
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, currentPassword, password } = req.body;
  const userId = req.user._id;

  // Create update data object
  const updateData = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;

  // Check if user wants to update password
  if (password) {
    // Verify current password
    const user = await userRepository.findByEmail(req.user.email, true);
    const isPasswordCorrect = await user.comparePassword(currentPassword);
    
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(password, salt);
  }

  // Update user
  const updatedUser = await userRepository.updateUser(userId, updateData);

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: updatedUser
    }
  });
});

const findUserByEmail = asyncHandler(async (req, res) => {
  const { email } = req.query;
  
  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required'
    });
  }

  const user = await userRepository.findByEmail(email);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found with this email'
    });
  }

  // Return limited information about the user for security
  res.status(200).json({
    success: true,
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    }
  });
});

module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  findUserByEmail
};