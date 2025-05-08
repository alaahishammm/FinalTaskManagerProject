const User = require('../../DB/models/user');
const Token = require('../../DB/models/token');
const jwt = require('jsonwebtoken');

/**
 * User Repository - Handles database operations for users
 */
class UserRepository {
  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<User>} - Created user
   */
  async createUser(userData) {
    return await User.create(userData);
  }

  /**
   * Find user by ID
   * @param {String} userId - User ID
   * @returns {Promise<User>} - Found user
   */
  async findById(userId) {
    return await User.findById(userId).select('-password');
  }

  /**
   * Find user by email
   * @param {String} email - User email
   * @param {Boolean} includePassword - Whether to include password in result
   * @returns {Promise<User>} - Found user
   */
  async findByEmail(email, includePassword = false) {
    if (includePassword) {
      return await User.findOne({ email }).select('+password');
    }
    return await User.findOne({ email });
  }

  /**
   * Update user
   * @param {String} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<User>} - Updated user
   */
  async updateUser(userId, updateData) {
    return await User.findByIdAndUpdate(
      userId, 
      updateData, 
      { new: true, runValidators: true }
    ).select('-password');
  }

  /**
   * Create JWT token for user
   * @param {String} userId - User ID
   * @returns {String} - JWT token
   */
  createToken(userId) {
    return jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  }

  /**
   * Save token to database (for logout functionality)
   * @param {String} userId - User ID
   * @param {String} token - JWT token
   * @returns {Promise<Token>} - Saved token
   */
  async saveToken(userId, token) {
    return await Token.create({ userId, token });
  }

  /**
   * Invalidate token (logout)
   * @param {String} token - JWT token
   * @returns {Promise<Token>} - Updated token
   */
  async invalidateToken(token) {
    return await Token.findOneAndUpdate(
      { token },
      { isValid: false },
      { new: true }
    );
  }
}

module.exports = new UserRepository();