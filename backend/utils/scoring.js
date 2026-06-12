/**
 * Scoring utility for car recommendation algorithm
 * Calculates match scores based on user preferences
 */

/**
 * Calculate overall score for a car based on user preferences
 * @param {Object} car - Car object from dataset
 * @param {Object} preferences - User preferences
 * @returns {number} - Score between 0 and 100
 */
function calculateScore(car, preferences) {
  let score = 0;
  let maxScore = 0;

  // Budget match (weight: 30)
  const budgetScore = calculateBudgetScore(car, preferences.budget);
  score += budgetScore * 0.3;
  maxScore += 30;

  // Fuel preference match (weight: 20)
  const fuelScore = calculateFuelScore(car, preferences.fuelType);
  score += fuelScore * 0.2;
  maxScore += 20;

  // Safety priority (weight: 20)
  const safetyScore = calculateSafetyScore(car, preferences.safetyPriority);
  score += safetyScore * 0.2;
  maxScore += 20;

  // Mileage priority (weight: 20)
  const mileageScore = calculateMileageScore(car, preferences.mileagePriority);
  score += mileageScore * 0.2;
  maxScore += 20;

  // Family size match (weight: 10)
  const familyScore = calculateFamilyScore(car, preferences.familySize);
  score += familyScore * 0.1;
  maxScore += 10;

  // Normalize to 0-100 scale
  return Math.round((score / maxScore) * 100);
}

/**
 * Calculate budget match score
 * @param {Object} car - Car object
 * @param {number} budget - User's budget
 * @returns {number} - Score between 0 and 100
 */
function calculateBudgetScore(car, budget) {
  if (!budget) return 50; // Neutral if no budget specified

  const priceDiff = Math.abs(car.price - budget);
  const percentageDiff = (priceDiff / budget) * 100;

  if (percentageDiff <= 10) return 100; // Within 10% of budget
  if (percentageDiff <= 20) return 80; // Within 20% of budget
  if (percentageDiff <= 30) return 60; // Within 30% of budget
  if (percentageDiff <= 50) return 40; // Within 50% of budget
  return 20; // Far from budget
}

/**
 * Calculate fuel type match score
 * @param {Object} car - Car object
 * @param {string} fuelType - User's preferred fuel type
 * @returns {number} - Score between 0 and 100
 */
function calculateFuelScore(car, fuelType) {
  if (!fuelType) return 50; // Neutral if no preference

  if (car.fuelType === fuelType) return 100;
  if (fuelType === 'hybrid' && car.fuelType === 'electric') return 80;
  if (fuelType === 'electric' && car.fuelType === 'hybrid') return 80;
  return 30; // Poor match
}

/**
 * Calculate safety score based on priority
 * @param {Object} car - Car object
 * @param {number} safetyPriority - User's safety priority (1-5)
 * @returns {number} - Score between 0 and 100
 */
function calculateSafetyScore(car, safetyPriority) {
  if (!safetyPriority) return 50; // Neutral if no priority

  const safetyRating = car.safetyRating || 3;
  
  // If safety is high priority (4-5), heavily weight the safety rating
  if (safetyPriority >= 4) {
    return (safetyRating / 5) * 100;
  }
  
  // If safety is medium priority (2-3), moderately weight safety rating
  if (safetyPriority >= 2) {
    return 50 + ((safetyRating / 5) * 50);
  }
  
  // If safety is low priority (1), safety matters less
  return 70 + ((safetyRating / 5) * 30);
}

/**
 * Calculate mileage score based on priority
 * @param {Object} car - Car object
 * @param {number} mileagePriority - User's mileage priority (1-5)
 * @returns {number} - Score between 0 and 100
 */
function calculateMileageScore(car, mileagePriority) {
  if (!mileagePriority) return 50; // Neutral if no priority

  const mileage = car.mileage || 25;
  
  // Normalize mileage: higher is better, cap at 100 MPG equivalent
  const normalizedMileage = Math.min(mileage, 100) / 100;
  
  // If mileage is high priority (4-5), heavily weight the mileage
  if (mileagePriority >= 4) {
    return normalizedMileage * 100;
  }
  
  // If mileage is medium priority (2-3), moderately weight mileage
  if (mileagePriority >= 2) {
    return 50 + (normalizedMileage * 50);
  }
  
  // If mileage is low priority (1), mileage matters less
  return 70 + (normalizedMileage * 30);
}

/**
 * Calculate family size match score
 * @param {Object} car - Car object
 * @param {number} familySize - User's family size (number of people)
 * @returns {number} - Score between 0 and 100
 */
function calculateFamilyScore(car, familySize) {
  if (!familySize) return 50; // Neutral if no family size specified

  // If family friendly car matches family size needs
  if (familySize <= 2) {
    // Small family - any car works
    return 100;
  }
  
  if (familySize <= 4) {
    // Medium family - prefer family friendly cars
    return car.familyFriendly ? 100 : 60;
  }
  
  // Large family (5+) - strongly prefer family friendly cars
  if (car.familyFriendly) {
    return 100;
  }
  
  return 20; // Poor match for large family
}

module.exports = {
  calculateScore,
  calculateBudgetScore,
  calculateFuelScore,
  calculateSafetyScore,
  calculateMileageScore,
  calculateFamilyScore
};
