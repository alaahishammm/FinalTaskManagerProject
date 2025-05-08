const Joi = require('joi');

// User registration validation schema
const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required()
    .messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name must not exceed 50 characters',
      'any.required': 'Name is required'
    }),
  email: Joi.string().trim().email().required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string().min(6).required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Please confirm your password'
    })
});

// User login validation schema
const loginSchema = Joi.object({
  email: Joi.string().trim().email().required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string().required()
    .messages({
      'any.required': 'Password is required'
    })
});

// User profile update validation schema
const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50)
    .messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name must not exceed 50 characters'
    }),
  email: Joi.string().trim().email()
    .messages({
      'string.email': 'Please provide a valid email address'
    }),
  currentPassword: Joi.string().min(6).when('password', {
    is: Joi.exist(),
    then: Joi.required(),
    otherwise: Joi.optional()
  }).messages({
    'string.min': 'Current password must be at least 6 characters long',
    'any.required': 'Current password is required when updating password'
  }),
  password: Joi.string().min(6).optional()
    .messages({
      'string.min': 'Password must be at least 6 characters long'
    }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).when('password', {
    is: Joi.exist(),
    then: Joi.required(),
    otherwise: Joi.optional()
  }).messages({
    'any.only': 'Passwords do not match'
  })
});

const searchUserSchema = Joi.object({
  email: Joi.string().trim().email().required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required for search',
      'string.empty': 'Email cannot be empty'
    })
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  searchUserSchema
};