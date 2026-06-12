/**
 * Recommendation controller
 * Handles HTTP requests for car recommendations
 */

const { getAllCars, getRecommendations } = require('../services/recommendationService');
const { generateCarExplanations } = require('../services/geminiService');

/**
 * Get all cars
 * @route GET /api/cars
 */
function getCars(req, res) {
  try {
    const cars = getAllCars();
    res.json({
      success: true,
      count: cars.length,
      data: cars
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cars',
      error: error.message
    });
  }
}

/**
 * Get car recommendations based on user preferences
 * @route POST /api/recommend
 */
async function getRecommendationsHandler(req, res) {
  try {
    const preferences = req.body;
    
    // Validate required fields
    if (!preferences) {
      return res.status(400).json({
        success: false,
        message: 'Preferences are required'
      });
    }
    
    const recommendations = getRecommendations(preferences);
    
    // Generate AI explanations for each recommended car
    const explanations = await generateCarExplanations(recommendations, preferences);
    
    // Attach explanations to each car
    const recommendationsWithExplanations = recommendations.map(car => ({
      ...car,
      explanation: explanations[car.id] || null
    }));
    
    res.json({
      success: true,
      count: recommendationsWithExplanations.length,
      data: recommendationsWithExplanations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating recommendations',
      error: error.message
    });
  }
}

module.exports = {
  getCars,
  getRecommendations: getRecommendationsHandler
};
