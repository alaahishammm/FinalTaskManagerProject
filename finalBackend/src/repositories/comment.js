const Comment = require('../../DB/models/comment');

/**
 * Comment Repository - Handles database operations for comments
 */
class CommentRepository {
  /**
   * Create a new comment
   * @param {Object} commentData - Comment data
   * @returns {Promise<Comment>} - Created comment
   */
  async createComment(commentData) {
    return await Comment.create(commentData);
  }

  /**
   * Find comment by ID
   * @param {String} commentId - Comment ID
   * @returns {Promise<Comment>} - Found comment
   */
  async findById(commentId) {
    return await Comment.findById(commentId).populate('author', 'name email');
  }

  /**
   * Find comments by task ID
   * @param {String} taskId - Task ID
   * @returns {Promise<Array<Comment>>} - Found comments
   */
  async findByTaskId(taskId) {
    return await Comment.find({ task_id: taskId })
      .populate('author', 'name email')
      .sort({ created_at: -1 });
  }

  /**
   * Update comment
   * @param {String} commentId - Comment ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Comment>} - Updated comment
   */
  async updateComment(commentId, updateData) {
    return await Comment.findByIdAndUpdate(
      commentId, 
      updateData, 
      { new: true, runValidators: true }
    ).populate('author', 'name email');
  }

  /**
   * Delete comment
   * @param {String} commentId - Comment ID
   * @returns {Promise<Comment>} - Deleted comment
   */
  async deleteComment(commentId) {
    return await Comment.findByIdAndDelete(commentId);
  }
}

module.exports = new CommentRepository();