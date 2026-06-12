import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show navigation on home page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav className="bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 text-white hover:text-purple-200 transition-colors"
          >
            <span className="text-3xl">🚗</span>
            <div className="text-left">
              <h1 className="text-xl font-bold">AutoMatch AI</h1>
              <p className="text-xs text-purple-200">Find Your Perfect Car</p>
            </div>
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-all duration-300 hover:scale-105"
            >
              🏠 Home
            </button>
            <button
              onClick={() => navigate('/questionnaire')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 ${
                location.pathname === '/questionnaire'
                  ? 'bg-white text-purple-900'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              📋 Find Cars
            </button>
            <button
              onClick={() => navigate('/shortlist')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 ${
                location.pathname === '/shortlist'
                  ? 'bg-white text-purple-900'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              ❤️ Shortlist
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
