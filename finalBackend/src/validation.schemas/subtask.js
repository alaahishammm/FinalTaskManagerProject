const Joi = require('joi');

// SubTask creation validation schema
const createSubTaskSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).required()
    .messages({
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title must not exceed 100 characters',
      'any.required': 'Title is required'
    }),
  is_completed: Joi.boolean().default(false),
  due_date: Joi.date().optional().allow(null)
    .messages({
      'date.base': 'Due date must be a valid date'
    }),
  task: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    .messages({
      'string.pattern.base': 'Invalid task ID format',
      'any.required': 'Task ID is required'
    })
}).label('SubTaskSchema'); // Add a label to help identify this schema

// SubTask update validation schema
const updateSubTaskSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100)
    .messages({
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title must not exceed 100 characters'
    }),
  is_completed: Joi.boolean(),
  due_date: Joi.date().allow(null)
    .messages({
      'date.base': 'Due date must be a valid date'
    })
}).label('UpdateSubTaskSchema'); // Add a label to help identify this schema

module.exports = {
  createSubTaskSchema,
  updateSubTaskSchema
};