/**
 * Vercel serverless function for getting all cars
 */

const fs = require('fs');
const path = require('path');

// Load cars data
const carsDataPath = path.join(__dirname, '../backend/data/cars.json');
let carsData = [];

try {
  const data = fs.readFileSync(carsDataPath, 'utf8');
  carsData = JSON.parse(data);
} catch (error) {
  console.error('Error loading cars data:', error);
}

function getAllCars() {
  return carsData;
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

  if (req.method === 'GET') {
    try {
      const cars = getAllCars();
      res.status(200).json({
        success: true,
        count: cars.length,
        data: cars
      });
    } catch (error) {
      console.error('Error fetching cars:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching cars',
        error: error.message
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
