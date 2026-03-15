import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Users, Clock } from 'lucide-react';
import { getRecommendations, getTopVenues } from '../data/engine';
import { NotificationsPanel } from './NotificationsPanel';

export function Header({ title }: { title: string }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const recommendations = getRecommendations();
    const venues = getTopVenues();

    const results = [
      ...recommendations
        .filter(
          (rec) =>
            rec.title.toLowerCase().includes(query.toLowerCase()) ||
            rec.description.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 3)
        .map((rec) => ({ ...rec, type: 'event' })),
      ...venues
        .filter(
          (venue) =>
            venue.name.toLowerCase().includes(query.toLowerCase()) ||
            venue.location.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 3)
        .map((venue) => ({ ...venue, type: 'venue' })),
    ];

    setSearchResults(results);
    setShowResults(true);
  };

  return (
    <>
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">{title}</h1>
        
        <div className="flex items-center gap-6">
          <div className="relative w-64">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search community..." 
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchQuery && setShowResults(true)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />

            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    onClick={() => {
                      if (result.type === 'event') {
                        navigate(`/event/${result.id}`);
                      } else {
                        navigate(`/venue/${result.id}`);
                      }
                      setSearchQuery('');
                      setShowResults(false);
                    }}
                    className="p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{result.title || result.name}</p>
                        {result.type === 'event' ? (
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" /> {result.ideal_size}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {result.ideal_duration}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <MapPin className="w-3 h-3" /> {result.location}
                          </div>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium text-white ${result.type === 'event' ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                        {result.type === 'event' ? 'Event' : 'Venue'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <NotificationsPanel />
        </div>
      </header>
      
      {/* Click outside to close search results */}
      {showResults && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowResults(false)}
        />
      )}
    </>
  );
}
