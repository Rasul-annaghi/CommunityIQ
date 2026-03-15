import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Card, CardContent } from '../components/Card';
import { mockVenues } from '../data/mockData';
import { MapPin, Users } from 'lucide-react';

export function Venues() {
  const navigate = useNavigate();
  
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50/50">
      <Header title="Venue Explorer" />
      
      <main className="p-8 space-y-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between">
          <p className="text-gray-500">Discover spaces that match your community's event needs.</p>
          <div className="flex gap-2">
            <select className="bg-white border border-gray-200 text-sm font-medium text-gray-700 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500/20">
              <option>All Types</option>
              <option>Co-working Space</option>
              <option>Studio</option>
              <option>Library Room</option>
              <option>Park Pavilion</option>
            </select>
          </div>
        </div>

        <div className="space-y-8">
          {mockVenues.map(venue => (
            <Card 
              key={venue.id} 
              className="overflow-hidden flex flex-col md:flex-row shadow-sm border border-gray-100 hover:border-emerald-200 transition-all cursor-pointer hover:shadow-md"
              onClick={() => navigate(`/venue/${venue.id}`)}
            >
              <div className="md:w-1/3 relative h-64 md:h-auto">
                <img 
                  src={venue.image} 
                  alt={venue.name} 
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/90 backdrop-blur text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                    {venue.type}
                  </span>
                </div>
              </div>
              
              <CardContent className="p-8 md:w-2/3 flex flex-col justify-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">{venue.name}</h2>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" /> {venue.location}
                  </span>
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" /> Up to {venue.capacity}
                  </span>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">Best For</h4>
                  <div className="flex flex-wrap gap-2">
                    {venue.suitability_tags.map(tag => (
                      <span key={tag} className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600 pt-6 border-t border-gray-100">
                  <span>
                    <span className="font-medium text-gray-900">{venue.suitability_score}%</span> Match • {venue.indoor_outdoor}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
