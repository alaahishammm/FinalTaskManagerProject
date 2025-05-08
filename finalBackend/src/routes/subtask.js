const express = require('express');
const { 
  createSubtask, 
  getSubtasks, 
  getSubtask, 
  updateSubtask, 
  toggleCompletion, 
  deleteSubtask 
} = require('../controllers/subtask');
const { authenticate } = require('../middlewares/authentication.middelware.js');
const { authorizeTaskAccess } = require('../middlewares/authorization.middelware.js');
const { validate } = require('../middlewares/validation.middleware.js');
const { createSubTaskSchema, updateSubTaskSchema } = require('../validation.schemas/subtask');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Create new subtask
router.post('/', validate(createSubTaskSchema), authorizeTaskAccess, createSubtask);

// Get all subtasks for a task
router.get('/task/:taskId', authorizeTaskAccess, getSubtasks);

// Routes for individual subtasks
router.route('/:id')
  .get(getSubtask)
  .put(validate(updateSubTaskSchema), updateSubtask)
  .delete(deleteSubtask);

// Toggle completion status
router.patch('/:id/toggle', toggleCompletion);

module.exports = router;