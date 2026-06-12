/**
 * Recommendation service
 * Business logic for car recommendations
 */

const fs = require('fs');
const path = require('path');
const { calculateScore } = require('../utils/scoring');

// Path to cars dataset
const carsDataPath = path.join(__dirname, '../data/cars.json');

/**
 * Load cars from JSON dataset
 * @returns {Array} - Array of car objects
 */
function loadCars() {
  try {
    const data = fs.readFileSync(carsDataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading cars data:', error);
    return [];
  }
}

/**
 * Get all cars
 * @returns {Array} - Array of all cars
 */
function getAllCars() {
  return loadCars();
}

/**
 * Get car recommendations based on user preferences
 * @param {Object} preferences - User preferences
 * @returns {Array} - Top 5 recommended cars with scores
 */
function getRecommendations(preferences) {
  const cars = loadCars();
  
  // Calculate scores for all cars
  const scoredCars = cars.map(car => ({
    ...car,
    score: calculateScore(car, preferences)
  }));
  
  // Sort by score (descending)
  scoredCars.sort((a, b) => b.score - a.score);
  
  // Return top 5 cars
  return scoredCars.slice(0, 5);
}

module.exports = {
  getAllCars,
  getRecommendations
};
