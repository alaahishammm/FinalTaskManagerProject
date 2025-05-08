const asyncHandler = require('../services/asyncHandler');
const commentRepository = require('../repositories/comment');
const taskRepository = require('../repositories/task');
const notificationService = require('../services/notificationService');

/**
 * Create a new comment
 */
const createComment = asyncHandler(async (req, res) => {
  const { content, task_id } = req.body;
  const author = req.user._id;

  // Check if task exists
  const task = await taskRepository.findById(task_id);
  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }

  // Create comment
  const comment = await commentRepository.createComment({
    content,
    author,
    task_id
  });

  // Add comment reference to task
  await taskRepository.addComment(task_id, comment._id);

  // Send notification to task participants
  await notificationService.notifyTaskComment(
    task_id,
    author,
    content
  );

  // Return populated comment
  const populatedComment = await commentRepository.findById(comment._id);

  res.status(201).json({
    success: true,
    message: 'Comment added successfully',
    data: { comment: populatedComment }
  });
});

/**
 * Get all comments for a task
 */
const getComments = asyncHandler(async (req, res) => {
  const taskId = req.params.taskId;
  
  // Check if task exists
  const task = await taskRepository.findById(taskId);
  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }

  // Get comments
  const comments = await commentRepository.findByTaskId(taskId);

  res.status(200).json({
    success: true,
    count: comments.length,
    data: { comments }
  });
});

/**
 * Get single comment by ID
 */
const getComment = asyncHandler(async (req, res) => {
  const commentId = req.params.id;
  
  const comment = await commentRepository.findById(commentId);
  
  if (!comment) {
    return res.status(404).json({
      success: false,
      message: 'Comment not found'
    });
  }

  res.status(200).json({
    success: true,
    data: { comment }
  });
});

/**
 * Update comment (only allowed for the author)
 */
const updateComment = asyncHandler(async (req, res) => {
  const commentId = req.params.id;
  const { content } = req.body;
  const userId = req.user._id;
  
  // Find comment
  const comment = await commentRepository.findById(commentId);
  
  if (!comment) {
    return res.status(404).json({
      success: false,
      message: 'Comment not found'
    });
  }

  // Check if user is the author
  if (comment.author._id.toString() !== userId.toString()) {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to update this comment'
    });
  }

  // Update comment
  const updatedComment = await commentRepository.updateComment(commentId, { content });

  res.status(200).json({
    success: true,
    message: 'Comment updated successfully',
    data: { comment: updatedComment }
  });
});

/**
 * Delete comment (only allowed for the author)
 */
const deleteComment = asyncHandler(async (req, res) => {
  const commentId = req.params.id;
  const userId = req.user._id;
  
  // Find comment
  const comment = await commentRepository.findById(commentId);
  
  if (!comment) {
    return res.status(404).json({
      success: false,
      message: 'Comment not found'
    });
  }

  // Check if user is the author
  if (comment.author._id.toString() !== userId.toString()) {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to delete this comment'
    });
  }

  // Delete comment
  await commentRepository.deleteComment(commentId);

  // Note: The comment reference in the parent task will remain,
  // but will be handled gracefully when populating tasks

  res.status(200).json({
    success: true,
    message: 'Comment deleted successfully'
  });
});

module.exports = {
  createComment,
  getComments,
  getComment,
  updateComment,
  deleteComment
};