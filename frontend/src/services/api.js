/**
 * API service for backend communication
 */

// Production-safe API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

/**
 * Get car recommendations based on user preferences
 * @param {Object} preferences - User preferences
 * @returns {Promise} - API response
 */
export async function getRecommendations(preferences) {
  try {
    console.log("API Request:", `${API_BASE_URL}/recommend`);

    const response = await fetch(`${API_BASE_URL}/recommend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", response.status, errorText);

      throw new Error(
        `Failed to get recommendations (${response.status})`
      );
    }

    const data = await response.json();
    console.log("API Response:", data);

    return data;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw error;
  }
}

/**
 * Get all cars
 * @returns {Promise} - API response
 */
export async function getAllCars() {
  try {
    console.log("API Request:", `${API_BASE_URL}/cars`);

    const response = await fetch(`${API_BASE_URL}/cars`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", response.status, errorText);

      throw new Error(
        `Failed to fetch cars (${response.status})`
      );
    }

    const data = await response.json();
    console.log("API Response:", data);

    return data;
  } catch (error) {
    console.error("Error fetching cars:", error);
    throw error;
  }
}