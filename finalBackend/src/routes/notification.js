const express = require('express');
const { 
  getNotifications, 
  markAsRead, 
  markAllAsRead 
} = require('../controllers/notification');
const { authenticate } = require('../middlewares/authentication.middelware');
const { validate } = require('../middlewares/validation.middleware');
const { markAsReadSchema } = require('../validation.schemas/notification');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all notifications for current user
router.get('/', getNotifications);

// Mark notification as read
router.patch('/read', validate(markAsReadSchema), markAsRead);

// Mark all notifications as read
router.patch('/read-all', markAllAsRead);

module.exports = router;