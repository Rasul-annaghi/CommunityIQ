import React from 'react';
import { Header } from '../components/Header';
import { Card, CardContent } from '../components/Card';
import { mockVenues } from '../data/mockData';
import { MapPin, Users, CheckCircle2 } from 'lucide-react';

export function Venues() {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockVenues.map(venue => (
            <Card key={venue.id} className="group overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={venue.image} 
                  alt={venue.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-sm font-bold text-emerald-600 shadow-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  {venue.suitability_score}% Match
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-gray-900/80 backdrop-blur text-white text-xs font-medium border border-white/10">
                    {venue.type}
                  </span>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">{venue.name}</h3>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" /> {venue.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" /> Up to {venue.capacity}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Best For</h4>
                  <div className="flex flex-wrap gap-2">
                    {venue.suitability_tags.map(tag => (
                      <span key={tag} className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">{venue.indoor_outdoor}</span>
                  <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                    View Details
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
