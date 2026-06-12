import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';

const Results = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});
  const [shortlist, setShortlist] = useState([]);
  const [preferences, setPreferences] = useState(null);

  const handleImageError = (carId) => {
    setImageErrors(prev => ({
      ...prev,
      [carId]: true
    }));
  };

  // Load shortlist from localStorage on mount
  useEffect(() => {
    const storedShortlist = localStorage.getItem('shortlist');
    if (storedShortlist) {
      setShortlist(JSON.parse(storedShortlist));
    }
  }, []);

  // Save shortlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('shortlist', JSON.stringify(shortlist));
  }, [shortlist]);

  const addToShortlist = (car) => {
    if (!shortlist.find(item => item.id === car.id)) {
      setShortlist([...shortlist, car]);
      // Dispatch custom event for same-tab updates
      window.dispatchEvent(new Event('shortlistUpdated'));
    }
  };

  const removeFromShortlist = (carId) => {
    setShortlist(shortlist.filter(item => item.id !== carId));
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event('shortlistUpdated'));
  };

  const isShortlisted = (carId) => {
    return shortlist.some(item => item.id === carId);
  };

  useEffect(() => {
    const storedResults = localStorage.getItem('recommendations');
    const storedPreferences = localStorage.getItem('preferences');
    if (storedResults) {
      setRecommendations(JSON.parse(storedResults));
    } else {
      navigate('/');
    }
    if (storedPreferences) {
      setPreferences(JSON.parse(storedPreferences));
    }
    setLoading(false);
  }, [navigate]);

  const handleRestart = () => {
    localStorage.removeItem('recommendations');
    navigate('/questionnaire');
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

  const generateSummary = () => {
    if (!preferences || !recommendations) return null;

    const topMatch = recommendations[0];
    const avgScore = Math.round(recommendations.reduce((acc, car) => acc + car.score, 0) / recommendations.length);
    
    return {
      budget: `₹${preferences.budget?.toLocaleString('en-IN') || 'Not specified'}`,
      fuelType: preferences.fuelType || 'Not specified',
      familySize: preferences.familySize || 'Not specified',
      safetyPriority: preferences.safetyPriority || 'Not specified',
      mileagePriority: preferences.mileagePriority || 'Not specified',
      topMatch: topMatch ? `${topMatch.make} ${topMatch.model}` : 'N/A',
      topMatchScore: topMatch ? topMatch.score : 0,
      avgScore: avgScore
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading recommendations...</p>
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Results Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find any matching cars.</p>
          <Button onClick={handleRestart}>Try Again</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Top Recommendations</h1>
          <p className="text-gray-600">Based on your preferences, here are the best matches</p>
        </div>

        {/* Personalized Summary */}
        {preferences && recommendations && (
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🎯</span>
              <h2 className="text-2xl font-bold text-gray-800">Your Personalized Summary</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Your Budget</p>
                <p className="text-xl font-bold text-blue-600">₹{preferences.budget?.toLocaleString('en-IN') || 'N/A'}</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Fuel Preference</p>
                <p className="text-xl font-bold text-purple-600 capitalize">{preferences.fuelType || 'Any'}</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Family Size</p>
                <p className="text-xl font-bold text-green-600">{preferences.familySize || 'Not specified'}</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Safety Priority</p>
                <p className="text-xl font-bold text-red-600">{preferences.safetyPriority || 'Not specified'}/5</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Mileage Priority</p>
                <p className="text-xl font-bold text-orange-600">{preferences.mileagePriority || 'Not specified'}/5</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Top Match</p>
                <p className="text-xl font-bold text-indigo-600">{recommendations[0]?.make} {recommendations[0]?.model || 'N/A'}</p>
                <p className="text-sm text-gray-500">{recommendations[0]?.score || 0}% Match</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
              <p className="text-gray-700 leading-relaxed">
                <span className="font-semibold text-gray-800">Summary:</span> Based on your budget of 
                <span className="font-semibold text-blue-600"> ₹{preferences.budget?.toLocaleString('en-IN') || 'N/A'}</span>, 
                preference for <span className="font-semibold text-purple-600 capitalize">{preferences.fuelType || 'any fuel type'}</span> vehicles, 
                and focus on <span className="font-semibold text-red-600">safety</span> and <span className="font-semibold text-orange-600">mileage</span>, 
                we found <span className="font-semibold text-green-600">{recommendations.length} cars</span> that match your needs. 
                Your top recommendation is the <span className="font-semibold text-indigo-600">{recommendations[0]?.make} {recommendations[0]?.model || 'N/A'}</span> 
                with a <span className="font-semibold text-green-600">{recommendations[0]?.score || 0}% match score</span>.
              </p>
            </div>
          </Card>
        )}

        {/* Comparison Table */}
        <Card className="mb-8 overflow-x-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Comparison Table</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Car</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Price</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Mileage</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Safety</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Fuel Type</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Score</th>
              </tr>
            </thead>
            <tbody>
              {recommendations.map((car, index) => (
                <tr key={car.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        #{index + 1}
                      </span>
                      <span className="font-semibold text-gray-800">
                        {car.make} {car.model}
                      </span>
                    </div>
                  </td>
                  <td className="text-center py-3 px-4 font-semibold text-gray-700">
                    ₹{car.price.toLocaleString('en-IN')}
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className={`font-semibold ${car.mileage > 35 ? 'text-green-600' : 'text-gray-700'}`}>
                      {car.mileage} MPG
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <div className="flex justify-center gap-1">
                      {Array(car.safetyRating).fill('⭐').map((star, i) => (
                        <span key={i}>{star}</span>
                      ))}
                    </div>
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold capitalize
                      ${car.fuelType === 'petrol' ? 'bg-blue-100 text-blue-800' : 
                        car.fuelType === 'diesel' ? 'bg-gray-100 text-gray-800' : 
                        car.fuelType === 'cng' ? 'bg-green-100 text-green-800' : 
                        'bg-gray-100 text-gray-800'}">
                      {car.fuelType}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className={`font-bold ${getScoreColor(car.score)}`}>
                      {car.score}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {recommendations.map((car, index) => (
            <Card key={car.id} className="relative overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-2xl h-full flex flex-col">
              {/* Match Score Badge */}
              <div className="absolute top-4 left-4 z-20">
                <div className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                  car.score >= 80 ? 'bg-green-500 text-white' :
                  car.score >= 60 ? 'bg-yellow-500 text-white' :
                  'bg-red-500 text-white'
                }`}>
                  {car.score}% Match
                </div>
              </div>

              <div className="absolute top-4 right-4 flex gap-2 z-20">
                <button
                  onClick={() => isShortlisted(car.id) ? removeFromShortlist(car.id) : addToShortlist(car)}
                  className={`p-2 rounded-full shadow-lg transition-all ${
                    isShortlisted(car.id) 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-white text-gray-400 hover:bg-red-50 hover:text-red-500'
                  }`}
                  title={isShortlisted(car.id) ? 'Remove from shortlist' : 'Add to shortlist'}
                >
                  {isShortlisted(car.id) ? '❤️' : '🤍'}
                </button>
                <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                  #{index + 1}
                </div>
              </div>
              
              {/* Car Image */}
              <div className="relative h-64 bg-gray-100 mb-4 overflow-hidden flex-shrink-0">
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

              <div className="mb-4 flex-shrink-0">
                <h3 className="text-2xl font-bold text-gray-800 truncate">
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

              {/* Why This Car Section */}
              {car.explanation && (
                <div className="border-t mt-4 pt-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 flex-grow">
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
          <Button onClick={() => navigate('/')} variant="secondary" className="mr-4">
            🏠 Back to Home
          </Button>
          <Button onClick={handleRestart} variant="secondary" className="mr-4">
            Start Over
          </Button>
          <Button onClick={() => navigate('/shortlist')} className="bg-red-500 hover:bg-red-600">
            ❤️ View Shortlist ({shortlist.length})
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;
