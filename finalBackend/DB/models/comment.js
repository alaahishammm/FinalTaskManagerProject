const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Comment must have an author']
  },
  task_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: [true, 'Comment must be associated with a task']
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;