const Joi = require('joi');

// Comment creation validation schema
const createCommentSchema = Joi.object({
  content: Joi.string().trim().min(1).max(500).required()
    .messages({
      'string.min': 'Comment content cannot be empty',
      'string.max': 'Comment must not exceed 500 characters',
      'any.required': 'Comment content is required'
    }),
  task_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    .messages({
      'string.pattern.base': 'Invalid task ID format',
      'any.required': 'Task ID is required'
    })
});

// Comment update validation schema
const updateCommentSchema = Joi.object({
  content: Joi.string().trim().min(1).max(500).required()
    .messages({
      'string.min': 'Comment content cannot be empty',
      'string.max': 'Comment must not exceed 500 characters',
      'any.required': 'Comment content is required'
    })
});

module.exports = {
  createCommentSchema,
  updateCommentSchema
};