const mongoose = require('mongoose');

const subTaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  is_completed: {
    type: Boolean,
    default: false
  },
  due_date: {
    type: Date
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: [true, 'SubTask must belong to a Task']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const SubTask = mongoose.model('SubTask', subTaskSchema);

module.exports = SubTask;