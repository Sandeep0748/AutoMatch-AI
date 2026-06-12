/**
 * Recommendation routes
 * API endpoints for car recommendations
 */

const express = require('express');
const router = express.Router();
const { getCars, getRecommendations } = require('../controllers/recommendationController');

/**
 * @route   GET /api/cars
 * @desc    Get all cars
 * @access  Public
 */
router.get('/cars', getCars);

/**
 * @route   POST /api/recommend
 * @desc    Get car recommendations based on preferences
 * @access  Public
 */
router.post('/recommend', getRecommendations);

module.exports = router;
