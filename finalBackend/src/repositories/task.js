const Task = require('../../DB/models/task');

/**
 * Task Repository - Handles database operations for tasks
 */
class TaskRepository {
  /**
   * Create a new task
   * @param {Object} taskData - Task data
   * @returns {Promise<Task>} - Created task
   */
  async createTask(taskData) {
    return await Task.create(taskData);
  }

/**
 * Find task by ID
 * @param {String} taskId - Task ID
 * @param {Boolean} populate - Whether to populate references
 * @returns {Promise<Task>} - Found task
 */
async findById(taskId, populate = false) {
  let query = Task.findById(taskId);
  
  if (populate) {
    query = query.populate('assigned_to_users', 'name email')
                .populate('created_by_user', 'name email')
                .populate('sub_tasks')
                .populate({
                  path: 'comments',
                  populate: {
                    path: 'author',
                    select: 'name email'
                  }
                });
  }
  
  return await query;
}


/**
 * Find tasks by user (either assigned to or created by)
 * @param {String} userId - User ID
 * @param {Object} filters - Additional filters
 * @returns {Promise<Array<Task>>} - Found tasks
 */
async findTasksByUser(userId, filters = {}) {
  const query = {
    $or: [
      { assigned_to_users: userId },
      { created_by_user: userId }
    ]
  };

  // Apply additional filters if provided
  if (filters.status) {
    query.status = filters.status;
  }
  
  if (filters.priority) {
    query.priority = filters.priority;
  }
  
  if (filters.due_date) {
    // If due_date is a range
    if (filters.due_date.start && filters.due_date.end) {
      query.due_date = {
        $gte: new Date(filters.due_date.start),
        $lte: new Date(filters.due_date.end)
      };
    } else if (filters.due_date.start) {
      query.due_date = { $gte: new Date(filters.due_date.start) };
    } else if (filters.due_date.end) {
      query.due_date = { $lte: new Date(filters.due_date.end) };
    }
  }

  return await Task.find(query)
    .populate('assigned_to_users', 'name email')
    .populate('created_by_user', 'name email')
    .sort({ due_date: 1 });
}

  /**
   * Update task
   * @param {String} taskId - Task ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Task>} - Updated task
   */
  async updateTask(taskId, updateData) {
    return await Task.findByIdAndUpdate(
      taskId, 
      updateData, 
      { new: true, runValidators: true }
    );
  }

  /**
   * Delete task
   * @param {String} taskId - Task ID
   * @returns {Promise<Task>} - Deleted task
   */
  async deleteTask(taskId) {
    return await Task.findByIdAndDelete(taskId);
  }

  /**
   * Add attachment to task
   * @param {String} taskId - Task ID
   * @param {Object} attachment - Attachment data (url, public_id, filename)
   * @returns {Promise<Task>} - Updated task
   */
  async addAttachment(taskId, attachment) {
    return await Task.findByIdAndUpdate(
      taskId,
      { $push: { attachments: attachment } },
      { new: true }
    );
  }

  /**
   * Remove attachment from task
   * @param {String} taskId - Task ID
   * @param {String} publicId - Cloudinary public ID
   * @returns {Promise<Task>} - Updated task
   */
  async removeAttachment(taskId, publicId) {
    return await Task.findByIdAndUpdate(
      taskId,
      { $pull: { attachments: { public_id: publicId } } },
      { new: true }
    );
  }

  /**
   * Add subtask reference to task
   * @param {String} taskId - Task ID
   * @param {String} subtaskId - Subtask ID
   * @returns {Promise<Task>} - Updated task
   */
  async addSubtask(taskId, subtaskId) {
    return await Task.findByIdAndUpdate(
      taskId,
      { $push: { sub_tasks: subtaskId } },
      { new: true }
    );
  }

  /**
   * Add comment reference to task
   * @param {String} taskId - Task ID
   * @param {String} commentId - Comment ID
   * @returns {Promise<Task>} - Updated task
   */
  async addComment(taskId, commentId) {
    return await Task.findByIdAndUpdate(
      taskId,
      { $push: { comments: commentId } },
      { new: true }
    );
  }
}

module.exports = new TaskRepository();