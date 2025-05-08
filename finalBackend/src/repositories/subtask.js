const SubTask = require('../../DB/models/subTask');

/**
 * SubTask Repository - Handles database operations for subtasks
 */
class SubTaskRepository {
  /**
   * Create a new subtask
   * @param {Object} subtaskData - SubTask data
   * @returns {Promise<SubTask>} - Created subtask
   */
  async createSubTask(subtaskData) {
    return await SubTask.create(subtaskData);
  }

  /**
   * Find subtask by ID
   * @param {String} subtaskId - SubTask ID
   * @returns {Promise<SubTask>} - Found subtask
   */
  async findById(subtaskId) {
    return await SubTask.findById(subtaskId);
  }

  /**
   * Find subtasks by task ID
   * @param {String} taskId - Task ID
   * @returns {Promise<Array<SubTask>>} - Found subtasks
   */
  async findByTaskId(taskId) {
    return await SubTask.find({ task: taskId }).sort({ createdAt: 1 });
  }

  /**
   * Update subtask
   * @param {String} subtaskId - SubTask ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<SubTask>} - Updated subtask
   */
  async updateSubTask(subtaskId, updateData) {
    return await SubTask.findByIdAndUpdate(
      subtaskId, 
      updateData, 
      { new: true, runValidators: true }
    );
  }

  /**
   * Delete subtask
   * @param {String} subtaskId - SubTask ID
   * @returns {Promise<SubTask>} - Deleted subtask
   */
  async deleteSubTask(subtaskId) {
    return await SubTask.findByIdAndDelete(subtaskId);
  }

  /**
   * Toggle subtask completion status
   * @param {String} subtaskId - SubTask ID
   * @returns {Promise<SubTask>} - Updated subtask
   */
  async toggleCompletion(subtaskId) {
    const subtask = await SubTask.findById(subtaskId);
    if (!subtask) {
      throw new Error('SubTask not found');
    }
    
    subtask.is_completed = !subtask.is_completed;
    return await subtask.save();
  }
}

module.exports = new SubTaskRepository();