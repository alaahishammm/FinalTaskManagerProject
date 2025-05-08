const Joi = require('joi');

// Mark notification as read validation schema
const markAsReadSchema = Joi.object({
  notificationId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    .messages({
      'string.pattern.base': 'Invalid notification ID format',
      'any.required': 'Notification ID is required'
    })
});

module.exports = {
  markAsReadSchema
};