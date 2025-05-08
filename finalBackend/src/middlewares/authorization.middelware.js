// src/middlewares/authorization.middelware.js
const Task = require('../../DB/models/task');
const asyncHandler = require('../services/asyncHandler');

/**
 * Task access authorization middleware
 * Verifies that user has access to the requested task
 */
const authorizeTaskAccess = asyncHandler(async (req, res, next) => {
  const taskId = req.params.id || req.body.taskId || req.body.task_id;
  
  if (!taskId) {
    return next();
  }

  const task = await Task.findById(taskId);
  
  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }

  const userId = req.user._id.toString();
  
  // Check if user is the creator
  const isCreator = task.created_by_user && task.created_by_user.toString() === userId;
  
  // Check if user is in assigned_to_users array
  const isAssigned = task.assigned_to_users && 
                     task.assigned_to_users.length > 0 && 
                     task.assigned_to_users.some(assignedUser => 
                       assignedUser && assignedUser.toString() === userId
                     );

  if (!isCreator && !isAssigned) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. You do not have permission to access this task.'
    });
  }

  // Add task to request for potential later use
  req.task = task;
  next();
});

module.exports = { authorizeTaskAccess };