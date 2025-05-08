const asyncHandler = require('../services/asyncHandler');
const taskRepository = require('../repositories/task');
const cloudService = require('../services/cloud');
const notificationService = require('../services/notificationService');

// src/controllers/task.js - Updated createTask function

// src/controllers/task.js - Updated createTask function
const createTask = asyncHandler(async (req, res) => {
  const { 
    title, description, due_date, priority, status, 
    assigned_to_users, isRecurring, recurrencePattern 
  } = req.body;
  
  const created_by_user = req.user._id;
  
  // Create task data object
  const taskData = {
    title,
    description,
    due_date,
    priority: priority || 'Medium',
    status: status || 'To Do',
    created_by_user,
    isRecurring: isRecurring || false,
    recurrencePattern: recurrencePattern || ''
  };
  
  // Add assigned_to_users if provided
  if (assigned_to_users && Array.isArray(assigned_to_users) && assigned_to_users.length > 0) {
    taskData.assigned_to_users = [...new Set(assigned_to_users)]; // Remove duplicates
  }

  // Create task
  const task = await taskRepository.createTask(taskData);

  // Send notifications to assigned users (if any)
  if (taskData.assigned_to_users && taskData.assigned_to_users.length > 0) {
    for (const assigneeId of taskData.assigned_to_users) {
      // Skip notification for the creator if they assigned themselves
      if (assigneeId.toString() !== created_by_user.toString()) {
        await notificationService.notifyTaskAssignment(
          task._id,
          assigneeId,
          created_by_user
        );
      }
    }
  }

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: { task }
  });
});
/**
 * Get all tasks for current user (either assigned or created)
 */
const getTasks = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  // Extract filter parameters from query
  const { status, priority, due_date_start, due_date_end } = req.query;
  
  const filters = {};
  if (status) filters.status = status;
  if (priority) filters.priority = priority;
  if (due_date_start || due_date_end) {
    filters.due_date = {};
    if (due_date_start) filters.due_date.start = due_date_start;
    if (due_date_end) filters.due_date.end = due_date_end;
  }

  // Get tasks where user is either assigned or creator
  const tasks = await taskRepository.findTasksByUser(userId, filters);

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: { tasks }
  });
});
/**
 * Get single task by ID
 */
const getTask = asyncHandler(async (req, res) => {
  const taskId = req.params.id;
  
  // Get task with populate
  const task = await taskRepository.findById(taskId, true);
  
  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }

  res.status(200).json({
    success: true,
    data: { task }
  });
});

// src/controllers/task.js - Updated updateTask function
const updateTask = asyncHandler(async (req, res) => {
  const taskId = req.params.id;
  const updateData = req.body;
  const originalTask = await taskRepository.findById(taskId);
  
  // Process assigned_to_users if provided
  if (updateData.assigned_to_users && Array.isArray(updateData.assigned_to_users)) {
    // Remove duplicates
    updateData.assigned_to_users = [...new Set(updateData.assigned_to_users)];
  }
  
  // Update task
  const task = await taskRepository.updateTask(taskId, updateData);
  
  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }

  // Send notifications for new assignees
  if (updateData.assigned_to_users && Array.isArray(updateData.assigned_to_users)) {
    // Get original assignees
    const originalAssignees = originalTask.assigned_to_users 
      ? originalTask.assigned_to_users.map(u => u.toString())
      : [];
    
    // Find new assignees
    const newAssignees = updateData.assigned_to_users.filter(
      userId => !originalAssignees.includes(userId.toString())
    );
    
    // Send notifications to new assignees
    for (const newAssignee of newAssignees) {
      await notificationService.notifyTaskAssignment(
        task._id,
        newAssignee,
        req.user._id
      );
    }
  }

  res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    data: { task }
  });
});
/**
 * Delete task
 */
const deleteTask = asyncHandler(async (req, res) => {
  const taskId = req.params.id;
  
  // Find task first to check attachments
  const task = await taskRepository.findById(taskId);
  
  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }

  // Delete attachments from cloud storage if any
  if (task.attachments && task.attachments.length > 0) {
    for (const attachment of task.attachments) {
      await cloudService.deleteFile(attachment.public_id);
    }
  }

  // Delete task
  await taskRepository.deleteTask(taskId);

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully'
  });
});

/**
 * Upload attachment to task
 */
const uploadAttachment = asyncHandler(async (req, res) => {
  const taskId = req.params.id;
  const file = req.file;
  
  if (!file) {
    return res.status(400).json({
      success: false,
      message: 'Please upload a file'
    });
  }

  // Upload file to cloud storage
  const result = await cloudService.uploadBuffer(
    file.buffer,
    file.originalname,
    `task-tracker/tasks/${taskId}`
  );

  // Add attachment to task
  const attachment = {
    url: result.secure_url,
    public_id: result.public_id,
    filename: file.originalname
  };

  const task = await taskRepository.addAttachment(taskId, attachment);

  res.status(200).json({
    success: true,
    message: 'File uploaded successfully',
    data: {
      attachment,
      task
    }
  });
});

/**
 * Delete attachment from task
 */
const deleteAttachment = asyncHandler(async (req, res) => {
  const taskId = req.params.id;
  const { public_id } = req.body;
  
  if (!public_id) {
    return res.status(400).json({
      success: false,
      message: 'Please provide public_id of attachment'
    });
  }

  // Delete from cloud storage
  await cloudService.deleteFile(public_id);

  // Remove from task
  const task = await taskRepository.removeAttachment(taskId, public_id);

  res.status(200).json({
    success: true,
    message: 'Attachment deleted successfully',
    data: { task }
  });
});

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  uploadAttachment,
  deleteAttachment
};