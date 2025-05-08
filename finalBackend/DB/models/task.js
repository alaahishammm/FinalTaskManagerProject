const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  due_date: {
    type: Date,
    required: [true, 'Due date is required']
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Done'],
    default: 'To Do'
  },
  attachments: [{
    url: String,
    public_id: String,
    filename: String
  }],
  created_by_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Task must have a creator']
  },
  
  // Optional field for multiple users
  assigned_to_users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrencePattern: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', ''],
    default: ''
  },
  nextOccurrence: {
    type: Date
  },
  sub_tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubTask'
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
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

// Calculate next occurrence date based on recurrence pattern
taskSchema.methods.calculateNextOccurrence = function() {
  if (!this.isRecurring || !this.recurrencePattern) {
    this.nextOccurrence = null;
    return;
  }

  const currentDate = new Date(this.due_date);
  let nextDate = new Date(currentDate);

  switch (this.recurrencePattern) {
    case 'daily':
      nextDate.setDate(currentDate.getDate() + 1);
      break;
    case 'weekly':
      nextDate.setDate(currentDate.getDate() + 7);
      break;
    case 'monthly':
      nextDate.setMonth(currentDate.getMonth() + 1);
      break;
    default:
      nextDate = null;
  }

  this.nextOccurrence = nextDate;
};

// Pre-save middleware to calculate next occurrence
taskSchema.pre('save', function(next) {
  // Calculate next occurrence if recurring
  if (this.isRecurring) {
    this.calculateNextOccurrence();
  }
  
  next();
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;