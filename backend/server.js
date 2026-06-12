/**
 * Express server for AutoMatch AI
 * Main entry point for the backend API
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const recommendationRoutes = require('./routes/recommendationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', recommendationRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({
    message: 'AutoMatch AI API is running',
    version: '1.0.0',
    endpoints: {
      cars: 'GET /api/cars',
      recommend: 'POST /api/recommend'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`AutoMatch AI server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}`);
});

module.exports = app;
