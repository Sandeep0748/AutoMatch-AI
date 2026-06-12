import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ShortlistButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [shortlistCount, setShortlistCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const storedShortlist = localStorage.getItem('shortlist');
      if (storedShortlist) {
        setShortlistCount(JSON.parse(storedShortlist).length);
      } else {
        setShortlistCount(0);
      }
    };

    updateCount();

    // Listen for storage changes
    window.addEventListener('storage', updateCount);
    
    // Custom event for same-tab updates
    window.addEventListener('shortlistUpdated', updateCount);

    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('shortlistUpdated', updateCount);
    };
  }, []);

  // Don't show on shortlist page
  if (location.pathname === '/shortlist') {
    return null;
  }

  return (
    <button
      onClick={() => navigate('/shortlist')}
      className="fixed bottom-6 right-6 bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 z-50 flex items-center gap-2"
      title="View Shortlist"
    >
      <span className="text-2xl">❤️</span>
      {shortlistCount > 0 && (
        <span className="bg-white text-red-500 text-xs font-bold px-2 py-1 rounded-full">
          {shortlistCount}
        </span>
      )}
    </button>
  );
};

export default ShortlistButton;
