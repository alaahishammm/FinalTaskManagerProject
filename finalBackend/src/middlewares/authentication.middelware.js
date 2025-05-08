const jwt = require('jsonwebtoken');
const User = require('../../DB/models/user');
const Token = require('../../DB/models/token');
const asyncHandler = require('../services/asyncHandler');

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request object
 */
const authenticate = asyncHandler(async (req, res, next) => {
  // Get token from Authorization header
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required. Please log in.' 
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if token is valid (not logged out)
    const tokenDoc = await Token.findOne({ token, userId: decoded.id, isValid: true });
    if (!tokenDoc) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token. Please log in again.' 
      });
    }
    
    // Find user
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found.' 
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid token. Please log in again.' 
    });
  }
});

module.exports = { authenticate };