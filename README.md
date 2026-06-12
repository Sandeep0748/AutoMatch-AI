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

2. Install all dependencies (single command)
```bash
npm install-all
```

3. Set up environment variables

Create a `.env` file in the `backend` directory:
```
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```

Create a `.env` file in the `frontend` directory (for production deployment):
```
VITE_API_URL=https://your-backend-url.com
```

For local development, use:
```
VITE_API_URL=http://localhost:5000
```

4. Start both servers (single command)
```bash
npm run dev
```

The backend will run on `http://localhost:5000`
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

### Backend
| Variable | Description | Required |
|----------|-------------|----------|
| GEMINI_API_KEY | Google Gemini API key for AI explanations | Yes |
| PORT | Backend server port | No (default: 5000) |

### Frontend
| Variable | Description | Required |
|----------|-------------|----------|
| VITE_API_URL | Backend API URL (e.g., https://your-backend-url.com) | Yes for production |

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

## Assignment Reflection

### What did you build and why? What did you deliberately cut?

**What I built:**
An AI-powered car recommendation system that helps confused car buyers go from "I don't know what to buy" to "I'm confident about my shortlist." The core problem is decision paralysis - buyers face too many options with no clear way to filter them. I built a solution that:

- Collects user preferences through a simple questionnaire (budget, fuel type, family size, safety/mileage priorities)
- Matches users against a curated dataset of 15 popular Indian cars
- Uses AI (Gemini) to generate personalized explanations for why each car fits
- Provides a shortlist feature so users can save and compare their top choices
- Shows a comparison table for side-by-side evaluation

**What I deliberately cut:**
- User authentication/login (not needed for the core use case)
- Social features (sharing, reviews) - focused on individual decision-making
- Advanced filtering (transmission type, color, specific features) - kept it to 5 key preferences
- Database persistence - used localStorage for shortlist, JSON file for car data
- Real-time inventory/pricing - used static dataset for simplicity
- Mobile app - focused on web experience
- Payment/financing integration - out of scope for recommendation phase

### What's your tech stack and why did you pick it?

**Frontend: React 18 + Vite + Tailwind CSS**
- React: Industry standard, fast development, great component ecosystem
- Vite: Lightning-fast dev server, modern build tool, better DX than CRA
- Tailwind CSS: Rapid UI development without writing custom CSS, responsive by default
- React Router: Simple client-side routing for multi-page experience

**Backend: Node.js + Express + Google Generative AI**
- Node.js: Same language as frontend, full-stack JavaScript, fast I/O
- Express: Minimal, unopinionated, perfect for REST APIs
- Google Generative AI (Gemini): Free tier available, good at generating explanations, easy integration
- CORS: Standard for cross-origin requests
- dotenv: Environment variable management for API keys

**Why this stack:**
- Fast to build (critical for 2-3 hour timebox)
- Modern and maintainable
- No build complexity (Vite handles everything)
- AI integration is straightforward
- Deployable to standard platforms (Vercel + Railway/Render)

### What did you delegate to AI tools vs do manually? Where did the tools help most? Where did they get in the way?

**What AI tools helped with:**
- **Initial project scaffolding**: AI generated the folder structure and basic setup commands
- **Component structure**: AI suggested the component breakdown (Layout, UI components, pages)
- **API design**: AI helped design the recommendation algorithm and scoring logic
- **Tailwind classes**: AI suggested responsive layouts and styling patterns
- **Error handling**: AI helped write middleware and error handling patterns
- **Car dataset**: AI helped generate realistic Indian car data with appropriate price ranges

**Where AI helped most:**
- Boilerplate code (server setup, routing, basic components)
- Design patterns (component composition, state management)
- Documentation (API docs, README structure)
- Debugging (quickly identifying syntax errors, missing imports)

**Where AI got in the way:**
- **Over-engineering**: AI suggested complex state management (Redux, Context) when simple useState was sufficient
- **Generic solutions**: AI gave generic car data instead of Indian-market-specific models
- **API integration**: AI's Gemini API examples were outdated, had to consult official docs
- **Styling**: AI suggested complex animations when simple transitions were better
- **File organization**: AI suggested over-abstracted folder structure, had to simplify

**What I did manually:**
- Curated the car dataset with real Indian models and prices
- Wrote the recommendation scoring algorithm (weighted matching logic)
- Designed the questionnaire flow and UX
- Implemented localStorage shortlist persistence
- Fine-tuned the AI prompts for better explanations
- Tested end-to-end user flows
- Deployment setup and environment configuration

### If you had another 4 hours, what would you add?

**Priority 1 - Better AI Integration:**
- Add fallback mode when Gemini API fails (rule-based explanations)
- Cache AI responses to reduce API calls and costs
- Add streaming responses for faster perceived performance

**Priority 2 - Enhanced User Experience:**
- Add car images from actual manufacturer sources (currently using Unsplash placeholders)
- Implement filters on results page (sort by price, mileage, safety)
- Add "why not" explanations for cars that didn't make the cut
- Include user reviews/ratings in the dataset

**Priority 3 - Technical Improvements:**
- Add unit tests for recommendation algorithm
- Implement proper database (PostgreSQL/MongoDB) instead of JSON file
- Add rate limiting and input validation
- Set up CI/CD pipeline
- Add error tracking (Sentry)

**Priority 4 - Deployment:**
- Deploy frontend to Vercel with automatic builds
- Deploy backend to Railway/Render
- Set up environment variables in production
- Add monitoring and logging

**Priority 5 - Additional Features:**
- Comparison tool with detailed spec breakdown
- Price trend visualization
- EMI calculator integration
- Dealer locator integration
- Shareable shortlist links

The current MVP focuses on the highest-value feature: getting users from confusion to a confident shortlist. These additions would enhance polish and completeness but aren't critical for the core user journey.

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
