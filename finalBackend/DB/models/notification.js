const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    trim: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Notification must have a recipient']
  },
  is_read: {
    type: Boolean,
    default: false
  },
  task_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;