const express = require('express');
const { 
  createTask, 
  getTasks, 
  getTask, 
  updateTask, 
  deleteTask,
  uploadAttachment,
  deleteAttachment
} = require('../controllers/task');
const { authenticate } = require('../middlewares/authentication.middelware.js');
const { authorizeTaskAccess } = require('../middlewares/authorization.middelware.js');
const { validate } = require('../middlewares/validation.middleware.js');
const { createTaskSchema, updateTaskSchema } = require('../validation.schemas/task');
const { uploadSingle } = require('../services/fileUpload');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Routes without task ID
// Important: Use the correct task validation schema here
router.post('/', validate(createTaskSchema), createTask);
router.get('/', getTasks);

// Routes with task ID
router.route('/:id')
  .get(authorizeTaskAccess, getTask)
  .put(authorizeTaskAccess, validate(updateTaskSchema), updateTask)
  .delete(authorizeTaskAccess, deleteTask);

// Attachment routes
router.route('/:id/attachments')
  .post(authorizeTaskAccess, uploadSingle, uploadAttachment);

router.route('/:id/attachments/delete')
  .post(authorizeTaskAccess, deleteAttachment);

module.exports = router;