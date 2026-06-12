/**
 * Vercel serverless function for recommendations
 * This allows the backend to be deployed on Vercel alongside the frontend
 */

const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load cars data
const carsDataPath = path.join(__dirname, '../backend/data/cars.json');
let carsData = [];

try {
  const data = fs.readFileSync(carsDataPath, 'utf8');
  carsData = JSON.parse(data);
} catch (error) {
  console.error('Error loading cars data:', error);
}

// Scoring functions (copied from utils/scoring.js for serverless compatibility)
function calculateScore(car, preferences) {
  let score = 0;
  let maxScore = 0;

  const budgetScore = calculateBudgetScore(car, preferences.budget);
  score += budgetScore * 0.3;
  maxScore += 30;

  const fuelScore = calculateFuelScore(car, preferences.fuelType);
  score += fuelScore * 0.2;
  maxScore += 20;

  const safetyScore = calculateSafetyScore(car, preferences.safetyPriority);
  score += safetyScore * 0.2;
  maxScore += 20;

  const mileageScore = calculateMileageScore(car, preferences.mileagePriority);
  score += mileageScore * 0.2;
  maxScore += 20;

  const familyScore = calculateFamilyScore(car, preferences.familySize);
  score += familyScore * 0.1;
  maxScore += 10;

  return Math.round((score / maxScore) * 100);
}

function calculateBudgetScore(car, budget) {
  if (!budget) return 50;
  const priceDiff = car.price - budget;
  const percentageDiff = (Math.abs(priceDiff) / budget) * 100;
  if (priceDiff > 0) {
    if (percentageDiff <= 5) return 100;
    if (percentageDiff <= 10) return 85;
    if (percentageDiff <= 20) return 60;
    if (percentageDiff <= 30) return 40;
    if (percentageDiff <= 50) return 20;
    return 10;
  } else {
    if (percentageDiff <= 10) return 100;
    if (percentageDiff <= 20) return 95;
    if (percentageDiff <= 30) return 90;
    if (percentageDiff <= 50) return 85;
    return 80;
  }
}

function calculateFuelScore(car, fuelType) {
  if (!fuelType) return 50;
  if (car.fuelType === fuelType) return 100;
  if (fuelType === 'hybrid' && car.fuelType === 'electric') return 80;
  if (fuelType === 'electric' && car.fuelType === 'hybrid') return 80;
  return 30;
}

function calculateSafetyScore(car, safetyPriority) {
  if (!safetyPriority) return 50;
  const safetyRating = car.safetyRating || 3;
  if (safetyPriority >= 4) return (safetyRating / 5) * 100;
  if (safetyPriority >= 2) return 50 + ((safetyRating / 5) * 50);
  return 70 + ((safetyRating / 5) * 30);
}

function calculateMileageScore(car, mileagePriority) {
  if (!mileagePriority) return 50;
  const mileage = car.mileage || 25;
  const normalizedMileage = Math.min(mileage, 100) / 100;
  if (mileagePriority >= 4) return normalizedMileage * 100;
  if (mileagePriority >= 2) return 50 + (normalizedMileage * 50);
  return 70 + (normalizedMileage * 30);
}

function calculateFamilyScore(car, familySize) {
  if (!familySize) return 50;
  if (familySize <= 2) return 100;
  if (familySize <= 4) return car.familyFriendly ? 100 : 60;
  if (car.familyFriendly) return 100;
  return 20;
}

function getRecommendations(preferences) {
  const scoredCars = carsData.map(car => ({
    ...car,
    score: calculateScore(car, preferences)
  }));
  scoredCars.sort((a, b) => b.score - a.score);
  return scoredCars.slice(0, 5);
}

// Gemini AI service
async function generateCarExplanations(cars, preferences) {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY not set, returning default explanations');
    return generateDefaultExplanations(cars, preferences);
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const explanations = {};

    for (const car of cars) {
      const prompt = buildPrompt(car, preferences);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      explanations[car.id] = parseAIResponse(text);
    }

    return explanations;
  } catch (error) {
    console.error('Error generating AI explanations:', error);
    return generateDefaultExplanations(cars, preferences);
  }
}

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

function parseAIResponse(text) {
  const sections = { whyItFits: '', pros: [], tradeoffs: [] };
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
      if (currentSection === 'pros') sections.pros.push(item);
      else if (currentSection === 'tradeoffs') sections.tradeoffs.push(item);
    } else if (currentSection === 'whyItFits' && trimmedLine) {
      sections.whyItFits += ' ' + trimmedLine;
    }
  }

  if (!sections.whyItFits && !sections.pros.length && !sections.tradeoffs.length) {
    return generateDefaultExplanation(text);
  }
  return sections;
}

function generateDefaultExplanations(cars, preferences) {
  const explanations = {};
  for (const car of cars) {
    explanations[car.id] = generateDefaultExplanationForCar(car, preferences);
  }
  return explanations;
}

function generateDefaultExplanationForCar(car, preferences) {
  const pros = [];
  const tradeoffs = [];

  if (car.safetyRating >= 4) pros.push(`Excellent safety rating of ${car.safetyRating}/5`);
  if (car.mileage > 35) pros.push(`Great fuel efficiency at ${car.mileage} MPG`);
  if (car.familyFriendly) pros.push('Family-friendly design with ample space');
  if (car.fuelType === 'hybrid' || car.fuelType === 'electric') pros.push(`Eco-friendly ${car.fuelType} powertrain`);
  if (car.price <= (preferences.budget || 50000)) pros.push('Fits within your budget');

  if (car.mileage < 30) tradeoffs.push('Lower fuel efficiency compared to hybrids/electrics');
  if (!car.familyFriendly && preferences.familySize && preferences.familySize.includes('5')) tradeoffs.push('May be tight for larger families');
  if (car.price > (preferences.budget || 50000) * 0.9) tradeoffs.push('Near the top of your budget range');

  const whyItFits = `The ${car.make} ${car.model} is a strong match with a ${car.score}% compatibility score. ${
    car.fuelType === preferences.fuelType ? `It matches your preferred ${car.fuelType} fuel type. ` : ''
  }${
    car.safetyRating >= 4 && preferences.safetyPriority >= 4 ? `With its excellent safety rating, it aligns with your high safety priority. ` : ''
  }${
    car.mileage > 35 && preferences.mileagePriority >= 4 ? `The impressive ${car.mileage} MPG meets your fuel efficiency needs. ` : ''
  }`;

  return {
    whyItFits: whyItFits.trim(),
    pros: pros.length > 0 ? pros : ['Well-rounded vehicle option'],
    tradeoffs: tradeoffs.length > 0 ? tradeoffs : ['Consider test drive to ensure comfort']
  };
}

function generateDefaultExplanation(text) {
  return {
    whyItFits: text.substring(0, 200) || 'This car matches your preferences based on the recommendation algorithm.',
    pros: ['Good overall value', 'Meets key requirements'],
    tradeoffs: ['May have minor compromises', 'Consider personal preferences']
  };
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
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
      
      res.status(200).json({
        success: true,
        count: recommendationsWithExplanations.length,
        data: recommendationsWithExplanations
      });
    } catch (error) {
      console.error('Error generating recommendations:', error);
      res.status(500).json({
        success: false,
        message: 'Error generating recommendations',
        error: error.message
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
