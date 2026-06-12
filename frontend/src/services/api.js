/**
 * API service for backend communication
 */

const API_BASE_URL = '/api';

/**
 * Get car recommendations based on user preferences
 * @param {Object} preferences - User preferences
 * @returns {Promise} - API response
 */
export async function getRecommendations(preferences) {
  try {
    const response = await fetch(`${API_BASE_URL}/recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      throw new Error('Failed to get recommendations');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
}

/**
 * Get all cars
 * @returns {Promise} - API response
 */
export async function getAllCars() {
  try {
    const response = await fetch(`${API_BASE_URL}/cars`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch cars');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching cars:', error);
    throw error;
  }
}
