const express = require('express');
const { 
  createComment, 
  getComments, 
  getComment, 
  updateComment, 
  deleteComment 
} = require('../controllers/comment');
const { authenticate } = require('../middlewares/authentication.middelware.js');
const { authorizeTaskAccess } = require('../middlewares/authorization.middelware.js');
const { validate } = require('../middlewares/validation.middleware.js');
const { createCommentSchema, updateCommentSchema } = require('../validation.schemas/comment');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Create new comment
router.post('/', validate(createCommentSchema), authorizeTaskAccess, createComment);

// Get all comments for a task
router.get('/task/:taskId', authorizeTaskAccess, getComments);

// Routes for individual comments
router.route('/:id')
  .get(getComment)
  .put(validate(updateCommentSchema), updateComment)
  .delete(deleteComment);

module.exports = router;