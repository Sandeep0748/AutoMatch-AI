import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import { getRecommendations } from '../services/api';

const Questionnaire = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    budget: '',
    fuelType: '',
    familySize: '',
    safetyPriority: '',
    mileagePriority: ''
  });

  const handleSubmit = async () => {
    // Validate all fields
    if (!preferences.budget || !preferences.fuelType || !preferences.familySize || 
        !preferences.safetyPriority || !preferences.mileagePriority) {
      alert('Please fill in all fields to get recommendations.');
      return;
    }

    setLoading(true);
    try {
      const response = await getRecommendations(preferences);
      // Store results and preferences in localStorage for the Results page
      localStorage.setItem('recommendations', JSON.stringify(response.data));
      localStorage.setItem('preferences', JSON.stringify(preferences));
      localStorage.setItem('recommendationsTimestamp', Date.now().toString());
      console.log('Image URLs from API:', response.data.map(car => ({ id: car.id, image: car.image })));
      navigate('/results');
    } catch (error) {
      console.error('Error getting recommendations:', error);
      alert('Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Find Your Perfect Car
          </h1>
          <p className="text-xl text-purple-200">
            Tell us your preferences and we'll find the best matches for you
          </p>
        </div>

        {/* Premium Form Card */}
        <Card className="bg-white/95 backdrop-blur-xl shadow-2xl border-0">
          <div className="p-8 space-y-10">
            
            {/* Budget Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">💰</span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Your Budget</h2>
                  <p className="text-gray-600">Select your maximum budget for a car</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['600000', '800000', '1000000', '1500000'].map((budget) => (
                  <button
                    key={budget}
                    onClick={() => updatePreference('budget', parseInt(budget))}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                      preferences.budget === parseInt(budget)
                        ? 'border-purple-600 bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-lg'
                        : 'border-gray-200 hover:border-purple-400 bg-white'
                    }`}
                  >
                    <span className="text-xl font-bold">₹{parseInt(budget).toLocaleString('en-IN')}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Fuel Type Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">⛽</span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Fuel Type Preference</h2>
                  <p className="text-gray-600">What type of fuel do you prefer?</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: 'petrol', label: 'Petrol', icon: '⛽', color: 'from-blue-500 to-blue-700' },
                  { value: 'diesel', label: 'Diesel', icon: '🛢️', color: 'from-gray-500 to-gray-700' },
                  { value: 'cng', label: 'CNG', icon: '🔥', color: 'from-green-500 to-green-700' }
                ].map((fuel) => (
                  <button
                    key={fuel.value}
                    onClick={() => updatePreference('fuelType', fuel.value)}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 flex items-center gap-4 ${
                      preferences.fuelType === fuel.value
                        ? `border-current bg-gradient-to-br ${fuel.color} text-white shadow-lg`
                        : 'border-gray-200 hover:border-purple-400 bg-white'
                    }`}
                  >
                    <span className="text-4xl">{fuel.icon}</span>
                    <span className="text-xl font-bold">{fuel.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Family Size Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">👨‍👩‍👧‍👦</span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Family Size</h2>
                  <p className="text-gray-600">How many people will typically be in the car?</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['1-2', '3-4', '5-6', '7+'].map((size) => (
                  <button
                    key={size}
                    onClick={() => updatePreference('familySize', size)}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                      preferences.familySize === size
                        ? 'border-purple-600 bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-lg'
                        : 'border-gray-200 hover:border-purple-400 bg-white'
                    }`}
                  >
                    <span className="text-xl font-bold">{size} people</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Safety Priority Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🛡️</span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Safety Importance</h2>
                  <p className="text-gray-600">How important is safety to you?</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => updatePreference('safetyPriority', level)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                      preferences.safetyPriority === level
                        ? 'border-purple-600 bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-lg'
                        : 'border-gray-200 hover:border-purple-400 bg-white'
                    }`}
                  >
                    <div className="text-center">
                      <div className="flex justify-center gap-1 mb-2">
                        {Array(level).fill('⭐').map((star, i) => (
                          <span key={i} className="text-xl">{star}</span>
                        ))}
                      </div>
                      <span className="text-sm font-semibold block">
                        {level === 1 && 'Not Important'}
                        {level === 2 && 'Slightly'}
                        {level === 3 && 'Moderate'}
                        {level === 4 && 'Very'}
                        {level === 5 && 'Extremely'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Mileage Priority Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">📊</span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Mileage Importance</h2>
                  <p className="text-gray-600">How important is fuel efficiency to you?</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => updatePreference('mileagePriority', level)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                      preferences.mileagePriority === level
                        ? 'border-purple-600 bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-lg'
                        : 'border-gray-200 hover:border-purple-400 bg-white'
                    }`}
                  >
                    <div className="text-center">
                      <div className="flex justify-center gap-1 mb-2">
                        {Array(level).fill('⛽').map((icon, i) => (
                          <span key={i} className="text-xl">{icon}</span>
                        ))}
                      </div>
                      <span className="text-sm font-semibold block">
                        {level === 1 && 'Not Important'}
                        {level === 2 && 'Slightly'}
                        {level === 3 && 'Moderate'}
                        {level === 4 && 'Very'}
                        {level === 5 && 'Extremely'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                {loading ? 'Finding Your Perfect Match...' : '🚗 Get Recommendations'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-purple-200">
          <p className="text-sm">
            Powered by AI • Matching you with the best cars in India
          </p>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
