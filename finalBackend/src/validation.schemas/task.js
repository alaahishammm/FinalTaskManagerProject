// src/validation.schemas/task.js
const Joi = require('joi');

// Task creation validation schema
const createTaskSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).required()
    .messages({
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title must not exceed 100 characters',
      'any.required': 'Title is required'
    }),
  description: Joi.string().trim().max(1000).optional()
    .messages({
      'string.max': 'Description must not exceed 1000 characters'
    }),
  due_date: Joi.date().greater('now').required()
    .messages({
      'date.greater': 'Due date must be in the future',
      'any.required': 'Due date is required'
    }),
  priority: Joi.string().valid('High', 'Medium', 'Low').default('Medium')
    .messages({
      'any.only': 'Priority must be High, Medium, or Low'
    }),
  status: Joi.string().valid('To Do', 'In Progress', 'Done').default('To Do')
    .messages({
      'any.only': 'Status must be To Do, In Progress, or Done'
    }),
  
  assigned_to_users: Joi.array().items(
    Joi.string().regex(/^[0-9a-fA-F]{24}$/).messages({
      'string.pattern.base': 'Invalid user ID format'
    })
  ).optional(),
  isRecurring: Joi.boolean().default(false),
  recurrencePattern: Joi.string().valid('daily', 'weekly', 'monthly', '').default('')
    .when('isRecurring', {
      is: true,
      then: Joi.string().valid('daily', 'weekly', 'monthly').required()
        .messages({
          'any.only': 'Recurrence pattern must be daily, weekly, or monthly',
          'any.required': 'Recurrence pattern is required for recurring tasks'
        }),
      otherwise: Joi.optional()
    })
}).label('CreateTaskSchema');

// Task update validation schema
const updateTaskSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).optional()
    .messages({
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title must not exceed 100 characters'
    }),
  description: Joi.string().trim().max(1000).allow('').optional()
    .messages({
      'string.max': 'Description must not exceed 1000 characters'
    }),
  due_date: Joi.date().greater('now').optional()
    .messages({
      'date.greater': 'Due date must be in the future'
    }),
  priority: Joi.string().valid('High', 'Medium', 'Low').optional()
    .messages({
      'any.only': 'Priority must be High, Medium, or Low'
    }),
  status: Joi.string().valid('To Do', 'In Progress', 'Done').optional()
    .messages({
      'any.only': 'Status must be To Do, In Progress, or Done'
    }),
  
  assigned_to_users: Joi.array().items(
    Joi.string().regex(/^[0-9a-fA-F]{24}$/).messages({
      'string.pattern.base': 'Invalid user ID format'
    })
  ).optional(),
  isRecurring: Joi.boolean().optional(),
  recurrencePattern: Joi.string().valid('daily', 'weekly', 'monthly', '').optional()
    .when('isRecurring', {
      is: true,
      then: Joi.string().valid('daily', 'weekly', 'monthly').required()
        .messages({
          'any.only': 'Recurrence pattern must be daily, weekly, or monthly',
          'any.required': 'Recurrence pattern is required for recurring tasks'
        })
    })
}).label('UpdateTaskSchema');

module.exports = {
  createTaskSchema,
  updateTaskSchema
};