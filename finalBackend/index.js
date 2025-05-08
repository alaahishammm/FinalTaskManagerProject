require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./DB/dbConnection');

// Import routes
const userRoutes = require('./src/routes/user');
const taskRoutes = require('./src/routes/task');
const subtaskRoutes = require('./src/routes/subtask');
const commentRoutes = require('./src/routes/comment');
const notificationRoutes = require('./src/routes/notification');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3005;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add request logger for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/subtasks', subtaskRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Task Tracker API is running');
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});