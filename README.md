# AutoMatch AI

An AI-powered car recommendation system that helps users find their perfect car based on their preferences. Built for the Indian market with popular car models and personalized recommendations.

## Features

- **AI-Powered Recommendations**: Uses Gemini AI to generate detailed explanations for car recommendations
- **Personalized Matching**: Considers budget, fuel type, family size, safety priority, and mileage priority
- **Indian Market Cars**: Features popular Indian car models (Maruti Suzuki, Tata, Hyundai)
- **Shortlist Functionality**: Save and compare favorite cars
- **Comparison Table**: Side-by-side comparison of top recommendations
- **Premium UI**: Modern, responsive design with smooth animations
- **Real-time Updates**: Live shortlist counter and instant feedback

## Tech Stack

### Frontend
- React 18
- Vite
- React Router
- Tailwind CSS

### Backend
- Node.js
- Express
- Google Generative AI (Gemini)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd AutoMatch AI
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Set up environment variables

Create a `.env` file in the `backend` directory:
```
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```

5. Start the backend server
```bash
cd backend
npm start
```

The backend will run on `http://localhost:5000`

6. Start the frontend development server
```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

## Usage

1. Open `http://localhost:3000` in your browser
2. Click "Find Your Perfect Car" to start the questionnaire
3. Fill in your preferences:
   - Budget (₹6L - ₹15L)
   - Fuel Type (Petrol, Diesel, CNG)
   - Family Size (1-2, 3-4, 5-6, 7+ people)
   - Safety Priority (1-5 stars)
   - Mileage Priority (1-5 stars)
4. Click "Get Recommendations" to see your personalized car matches
5. Save cars to your shortlist using the heart button
6. View your shortlist anytime using the floating heart button

## Project Structure

```
AutoMatch AI/
├── backend/
│   ├── controllers/
│   │   └── recommendationController.js
│   ├── data/
│   │   └── cars.json
│   ├── routes/
│   │   └── recommendationRoutes.js
│   ├── services/
│   │   └── geminiService.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   │   ├── Navigation.jsx
│   │   │   │   └── ShortlistButton.jsx
│   │   │   └── UI/
│   │   │       ├── Button.jsx
│   │   │       ├── Card.jsx
│   │   │       └── ProgressBar.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Questionnaire.jsx
│   │   │   ├── Results.jsx
│   │   │   └── Shortlist.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## API Endpoints

### POST /api/recommendations
Get personalized car recommendations based on user preferences.

**Request Body:**
```json
{
  "budget": 800000,
  "fuelType": "petrol",
  "familySize": "3-4",
  "safetyPriority": 5,
  "mileagePriority": 4
}
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "make": "Maruti Suzuki",
      "model": "Swift",
      "price": 650000,
      "fuelType": "petrol",
      "mileage": 22,
      "safetyRating": 4,
      "familyFriendly": true,
      "score": 85,
      "explanation": {
        "whyItFits": "...",
        "pros": ["...", "..."],
        "tradeoffs": ["..."]
      }
    }
  ]
}
```

## Car Dataset

The application includes 15 popular Indian car models:
- Maruti Suzuki: Swift, Baleno, Brezza, Dzire, Wagon R
- Tata: Punch, Nexon, Altroz, Tiago, Safari
- Hyundai: Exter, Venue, i20, Creta, Grand i10 Nios

Each car includes:
- Price in INR
- Mileage in km/l
- Safety rating (1-5)
- Family-friendly indicator
- Fuel type (petrol, diesel, CNG)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| GEMINI_API_KEY | Google Gemini API key for AI explanations | Yes |
| PORT | Backend server port | No (default: 5000) |

## Features in Detail

### AI Explanations
Each car recommendation includes AI-generated explanations:
- Why the car fits your preferences
- Pros of the car
- Tradeoffs to consider

### Shortlist System
- Save cars to your shortlist
- Persistent storage using localStorage
- Quick access from any page
- Remove cars easily

### Comparison Table
- Side-by-side comparison of top 5 recommendations
- Compare price, mileage, safety, fuel type, and match score

### Personalized Summary
- Overview of your preferences
- Top match highlight
- Average match score

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is for educational purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues or questions, please open an issue on the repository.

## Acknowledgments

- Google Generative AI for powering the recommendation explanations
- Unsplash for car images
- Tailwind CSS for styling
