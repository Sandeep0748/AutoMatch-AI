/**
 * Gemini AI service
 * Generates AI explanations for car recommendations
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Generate AI explanation for car recommendations
 * @param {Array} cars - Recommended cars
 * @param {Object} preferences - User preferences
 * @returns {Promise<Object>} - AI explanations for each car
 */
async function generateCarExplanations(cars, preferences) {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY not set, returning default explanations');
    return generateDefaultExplanations(cars, preferences);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const explanations = {};

    for (const car of cars) {
      const prompt = buildPrompt(car, preferences);
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse the AI response into structured format
      explanations[car.id] = parseAIResponse(text);
    }

    return explanations;
  } catch (error) {
    console.error('Error generating AI explanations:', error);
    // Fallback to default explanations if AI fails
    return generateDefaultExplanations(cars, preferences);
  }
}

/**
 * Build prompt for Gemini AI
 * @param {Object} car - Car object
 * @param {Object} preferences - User preferences
 * @returns {string} - Formatted prompt
 */
function buildPrompt(car, preferences) {
  return `You are a car recommendation expert for the Indian market. Analyze this car recommendation and provide a detailed explanation.

Car Details:
- Make: ${car.make}
- Model: ${car.model}
- Price: ₹${car.price.toLocaleString('en-IN')}
- Fuel Type: ${car.fuelType}
- Mileage: ${car.mileage} km/l
- Safety Rating: ${car.safetyRating}/5
- Family Friendly: ${car.familyFriendly ? 'Yes' : 'No'}
- Match Score: ${car.score}%

User Preferences:
- Budget: ₹${preferences.budget?.toLocaleString('en-IN') || 'Not specified'}
- Fuel Type: ${preferences.fuelType || 'Not specified'}
- Family Size: ${preferences.familySize || 'Not specified'}
- Safety Priority: ${preferences.safetyPriority || 'Not specified'}/5
- Mileage Priority: ${preferences.mileagePriority || 'Not specified'}/5

Please provide a structured response in the following format:

WHY IT FITS:
[Brief explanation of why this car matches the user's preferences]

PROS:
- [List 3-5 key advantages]
- [Each on a new line with a dash]

POTENTIAL TRADEOFFS:
- [List 2-3 potential downsides]
- [Each on a new line with a dash]

Keep the response concise and practical. Focus on how the car's features align with the user's stated preferences.`;
}

/**
 * Parse AI response into structured format
 * @param {string} text - AI response text
 * @returns {Object} - Structured explanation
 */
function parseAIResponse(text) {
  const sections = {
    whyItFits: '',
    pros: [],
    tradeoffs: []
  };

  const lines = text.split('\n');
  let currentSection = '';

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine.toUpperCase().startsWith('WHY IT FITS:')) {
      currentSection = 'whyItFits';
      sections.whyItFits = trimmedLine.replace('WHY IT FITS:', '').trim();
    } else if (trimmedLine.toUpperCase().startsWith('PROS:')) {
      currentSection = 'pros';
    } else if (trimmedLine.toUpperCase().startsWith('POTENTIAL TRADEOFFS:')) {
      currentSection = 'tradeoffs';
    } else if (trimmedLine.startsWith('-')) {
      const item = trimmedLine.replace('-', '').trim();
      if (currentSection === 'pros') {
        sections.pros.push(item);
      } else if (currentSection === 'tradeoffs') {
        sections.tradeoffs.push(item);
      }
    } else if (currentSection === 'whyItFits' && trimmedLine) {
      sections.whyItFits += ' ' + trimmedLine;
    }
  }

  // Fallback if parsing fails
  if (!sections.whyItFits && !sections.pros.length && !sections.tradeoffs.length) {
    return generateDefaultExplanation(text);
  }

  return sections;
}

/**
 * Generate default explanations (fallback)
 * @param {Array} cars - Recommended cars
 * @param {Object} preferences - User preferences
 * @returns {Object} - Default explanations
 */
function generateDefaultExplanations(cars, preferences) {
  const explanations = {};

  for (const car of cars) {
    explanations[car.id] = generateDefaultExplanationForCar(car, preferences);
  }

  return explanations;
}

/**
 * Generate default explanation for a single car
 * @param {Object} car - Car object
 * @param {Object} preferences - User preferences
 * @returns {Object} - Default explanation
 */
function generateDefaultExplanationForCar(car, preferences) {
  const pros = [];
  const tradeoffs = [];

  // Build pros based on car features
  if (car.safetyRating >= 4) {
    pros.push(`Excellent safety rating of ${car.safetyRating}/5`);
  }
  if (car.mileage > 35) {
    pros.push(`Great fuel efficiency at ${car.mileage} MPG`);
  }
  if (car.familyFriendly) {
    pros.push('Family-friendly design with ample space');
  }
  if (car.fuelType === 'hybrid' || car.fuelType === 'electric') {
    pros.push(`Eco-friendly ${car.fuelType} powertrain`);
  }
  if (car.price <= (preferences.budget || 50000)) {
    pros.push('Fits within your budget');
  }

  // Build tradeoffs
  if (car.mileage < 30) {
    tradeoffs.push('Lower fuel efficiency compared to hybrids/electrics');
  }
  if (!car.familyFriendly && preferences.familySize && preferences.familySize.includes('5')) {
    tradeoffs.push('May be tight for larger families');
  }
  if (car.price > (preferences.budget || 50000) * 0.9) {
    tradeoffs.push('Near the top of your budget range');
  }

  const whyItFits = `The ${car.make} ${car.model} is a strong match with a ${car.score}% compatibility score. ${
    car.fuelType === preferences.fuelType 
      ? `It matches your preferred ${car.fuelType} fuel type. ` 
      : ''
  }${
    car.safetyRating >= 4 && preferences.safetyPriority >= 4
      ? `With its excellent safety rating, it aligns with your high safety priority. `
      : ''
  }${
    car.mileage > 35 && preferences.mileagePriority >= 4
      ? `The impressive ${car.mileage} MPG meets your fuel efficiency needs. `
      : ''
  }`;

  return {
    whyItFits: whyItFits.trim(),
    pros: pros.length > 0 ? pros : ['Well-rounded vehicle option'],
    tradeoffs: tradeoffs.length > 0 ? tradeoffs : ['Consider test drive to ensure comfort']
  };
}

/**
 * Generate default explanation from raw text
 * @param {string} text - Raw text
 * @returns {Object} - Structured explanation
 */
function generateDefaultExplanation(text) {
  return {
    whyItFits: text.substring(0, 200) || 'This car matches your preferences based on the recommendation algorithm.',
    pros: ['Good overall value', 'Meets key requirements'],
    tradeoffs: ['May have minor compromises', 'Consider personal preferences']
  };
}

module.exports = {
  generateCarExplanations
};
