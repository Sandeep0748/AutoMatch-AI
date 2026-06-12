import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';

const Shortlist = () => {
  const navigate = useNavigate();
  const [shortlist, setShortlist] = useState([]);
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (carId) => {
    setImageErrors(prev => ({
      ...prev,
      [carId]: true
    }));
  };

  // Load shortlist from localStorage on mount
  useEffect(() => {
    const storedShortlist = localStorage.getItem('shortlist');
    console.log('Shortlist page - Loading from localStorage:', storedShortlist);
    if (storedShortlist) {
      const parsed = JSON.parse(storedShortlist);
      console.log('Shortlist page - Parsed data:', parsed);
      setShortlist(parsed);
    }
    
    // Listen for shortlist updates from other pages
    const handleShortlistUpdate = () => {
      const updatedShortlist = localStorage.getItem('shortlist');
      console.log('Shortlist page - Received shortlistUpdated event:', updatedShortlist);
      if (updatedShortlist) {
        setShortlist(JSON.parse(updatedShortlist));
      }
    };
    
    window.addEventListener('shortlistUpdated', handleShortlistUpdate);
    
    return () => {
      window.removeEventListener('shortlistUpdated', handleShortlistUpdate);
    };
  }, []);

  // Note: We don't save to localStorage here to avoid overwriting data on mount
  // The Results page handles saving, and we only dispatch events when removing

  const removeFromShortlist = (carId) => {
    const updatedShortlist = shortlist.filter(item => item.id !== carId);
    setShortlist(updatedShortlist);
    // Save to localStorage and dispatch event
    localStorage.setItem('shortlist', JSON.stringify(updatedShortlist));
    window.dispatchEvent(new Event('shortlistUpdated'));
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    return 'Fair Match';
  };

  if (shortlist.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <div className="text-6xl mb-4">🤍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Shortlist is Empty</h2>
          <p className="text-gray-600 mb-6">
            Save cars you like by clicking the heart icon on the results page.
          </p>
          <Button onClick={() => navigate('/questionnaire')}>
            Find Cars
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Shortlist</h1>
          <p className="text-gray-600">{shortlist.length} car{shortlist.length !== 1 ? 's' : ''} saved</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {shortlist.map((car, index) => (
            <Card key={car.id} className="relative overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-2xl">
              {/* Match Score Badge */}
              {car.score && (
                <div className="absolute top-4 left-4 z-20">
                  <div className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                    car.score >= 80 ? 'bg-green-500 text-white' :
                    car.score >= 60 ? 'bg-yellow-500 text-white' :
                    'bg-red-500 text-white'
                  }`}>
                    {car.score}% Match
                  </div>
                </div>
              )}

              <div className="absolute top-4 right-4 flex gap-2 z-20">
                <button
                  onClick={() => removeFromShortlist(car.id)}
                  className="p-2 rounded-full shadow-lg transition-all bg-red-500 text-white hover:bg-red-600"
                  title="Remove from shortlist"
                >
                  ❤️
                </button>
              </div>
              
              {/* Car Image */}
              <div className="relative h-64 bg-gray-100 mb-4 overflow-hidden">
                {imageErrors[car.id] ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <div className="text-center">
                      <span className="text-4xl mb-2 block">🚗</span>
                      <p className="text-gray-500 text-sm">Image unavailable</p>
                    </div>
                  </div>
                ) : (
                  <img
                    src={car.image || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80'}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    onError={() => handleImageError(car.id)}
                  />
                )}
              </div>

              <div className="mb-4">
                <h3 className="text-2xl font-bold text-gray-800">
                  {car.make} {car.model}
                </h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  ₹{car.price.toLocaleString('en-IN')}
                </p>
              </div>

              {/* Chips for quick info */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold capitalize
                  ${car.fuelType === 'petrol' ? 'bg-blue-100 text-blue-800' : 
                    car.fuelType === 'diesel' ? 'bg-gray-100 text-gray-800' : 
                    car.fuelType === 'cng' ? 'bg-green-100 text-green-800' : 
                    'bg-gray-100 text-gray-800'}">
                  ⚡ {car.fuelType}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${car.mileage > 18 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  📊 {car.mileage} km/l
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                  ⭐ {car.safetyRating}/5 Safety
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Mileage:</span>
                  <span className="font-semibold">{car.mileage} km/l</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Safety Rating:</span>
                  <div className="flex gap-1">
                    {Array(car.safetyRating).fill('⭐').map((star, i) => (
                      <span key={i} className="text-xl">{star}</span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Family Friendly:</span>
                  <span className={`font-semibold ${car.familyFriendly ? 'text-green-600' : 'text-red-600'}`}>
                    {car.familyFriendly ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
              </div>

              {car.score && (
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 font-semibold">Match Score:</span>
                    <span className={`text-3xl font-bold ${getScoreColor(car.score)}`}>
                      {car.score}%
                    </span>
                  </div>
                  <p className={`text-sm font-semibold ${getScoreColor(car.score)}`}>
                    {getScoreLabel(car.score)}
                  </p>
                </div>
              )}

              {/* Why This Car Section */}
              {car.explanation && (
                <div className="border-t mt-4 pt-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">💡</span>
                    <h4 className="font-bold text-gray-800">Why This Car?</h4>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                    {car.explanation.whyItFits}
                  </p>
                  
                  {car.explanation.pros && car.explanation.pros.length > 0 && (
                    <div className="mb-3">
                      <p className="font-semibold text-green-700 mb-2 text-sm">✨ Pros:</p>
                      <ul className="space-y-1">
                        {car.explanation.pros.map((pro, i) => (
                          <li key={i} className="text-gray-600 text-sm flex items-start gap-2">
                            <span className="text-green-500">✓</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {car.explanation.tradeoffs && car.explanation.tradeoffs.length > 0 && (
                    <div>
                      <p className="font-semibold text-orange-700 mb-2 text-sm">⚠️ Tradeoffs:</p>
                      <ul className="space-y-1">
                        {car.explanation.tradeoffs.map((tradeoff, i) => (
                          <li key={i} className="text-gray-600 text-sm flex items-start gap-2">
                            <span className="text-orange-500">!</span>
                            <span>{tradeoff}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button onClick={() => navigate('/questionnaire')} variant="secondary">
            Find More Cars
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Shortlist;
