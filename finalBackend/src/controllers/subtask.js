const asyncHandler = require('../services/asyncHandler');
const subtaskRepository = require('../repositories/subtask');
const taskRepository = require('../repositories/task');

/**
 * Create a new subtask
 */
const createSubtask = asyncHandler(async (req, res) => {
  const { title, is_completed, due_date, task } = req.body;

  console.log('Creating subtask with task ID:', task);
  
  // Check if parent task exists
  const parentTask = await taskRepository.findById(task);
  console.log('Parent task found?', !!parentTask);
  
  if (!parentTask) {
    return res.status(404).json({
      success: false,
      message: 'Parent task not found'
    });
  }

  // Create subtask
  const subtask = await subtaskRepository.createSubTask({
    title,
    is_completed,
    due_date,
    task
  });

  // Add subtask reference to parent task
  await taskRepository.addSubtask(task, subtask._id);

  res.status(201).json({
    success: true,
    message: 'Subtask created successfully',
    data: { subtask }
  });
});

/**
 * Get all subtasks for a task
 */
const getSubtasks = asyncHandler(async (req, res) => {
  const taskId = req.params.taskId;
  
  // Check if task exists
  const task = await taskRepository.findById(taskId);
  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }

  // Get subtasks
  const subtasks = await subtaskRepository.findByTaskId(taskId);

  res.status(200).json({
    success: true,
    count: subtasks.length,
    data: { subtasks }
  });
});

/**
 * Get single subtask by ID
 */
const getSubtask = asyncHandler(async (req, res) => {
  const subtaskId = req.params.id;
  
  const subtask = await subtaskRepository.findById(subtaskId);
  
  if (!subtask) {
    return res.status(404).json({
      success: false,
      message: 'Subtask not found'
    });
  }

  res.status(200).json({
    success: true,
    data: { subtask }
  });
});

/**
 * Update subtask
 */
const updateSubtask = asyncHandler(async (req, res) => {
  const subtaskId = req.params.id;
  const updateData = req.body;
  
  const subtask = await subtaskRepository.updateSubTask(subtaskId, updateData);
  
  if (!subtask) {
    return res.status(404).json({
      success: false,
      message: 'Subtask not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Subtask updated successfully',
    data: { subtask }
  });
});

/**
 * Toggle subtask completion status
 */
const toggleCompletion = asyncHandler(async (req, res) => {
  const subtaskId = req.params.id;
  
  const subtask = await subtaskRepository.toggleCompletion(subtaskId);
  
  if (!subtask) {
    return res.status(404).json({
      success: false,
      message: 'Subtask not found'
    });
  }

  res.status(200).json({
    success: true,
    message: `Subtask marked as ${subtask.is_completed ? 'completed' : 'incomplete'}`,
    data: { subtask }
  });
});

/**
 * Delete subtask
 */
const deleteSubtask = asyncHandler(async (req, res) => {
  const subtaskId = req.params.id;
  
  const subtask = await subtaskRepository.findById(subtaskId);
  if (!subtask) {
    return res.status(404).json({
      success: false,
      message: 'Subtask not found'
    });
  }

  // Delete subtask
  await subtaskRepository.deleteSubTask(subtaskId);

  // Note: The subtask reference in the parent task will remain,
  // but will be handled gracefully when populating tasks

  res.status(200).json({
    success: true,
    message: 'Subtask deleted successfully'
  });
});

module.exports = {
  createSubtask,
  getSubtasks,
  getSubtask,
  updateSubtask,
  toggleCompletion,
  deleteSubtask
};