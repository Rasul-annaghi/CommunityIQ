import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Card, CardContent } from '../components/Card';
import { mockVenues } from '../data/mockData';
import { ArrowLeft, MapPin, Users } from 'lucide-react';

export function VenueDetails() {
  const { venueId } = useParams<{ venueId: string }>();
  const navigate = useNavigate();
  
  const venue = mockVenues.find(v => v.id === venueId);

  if (!venue) {
    return <div className="flex-1 p-8">Venue not found</div>;
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50/50">
      <Header title={venue.name} />
      
      <main className="p-8 space-y-8 max-w-4xl mx-auto w-full">
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/venues')}
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Venues
        </button>

        {/* Hero Image */}
        <div className="relative h-96 rounded-3xl overflow-hidden shadow-lg border border-gray-100">
          <img
            src={venue.image}
            alt={venue.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
          <div className="absolute bottom-6 left-8 right-8">
            <span className="px-4 py-2 rounded-full bg-emerald-500/90 backdrop-blur text-white text-sm font-bold uppercase tracking-wider shadow-md">
              {venue.type}
            </span>
          </div>
        </div>

        {/* Venue Title and Summary */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{venue.name}</h1>
          <div className="flex items-center gap-4 text-gray-600 mb-6">
            <span className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" /> {venue.location}
            </span>
            <span className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" /> Up to {venue.capacity} people
            </span>
          </div>
        </div>

        {/* Key Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="bg-white">
            <CardContent className="p-6">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Match Score</p>
                <p className="text-3xl font-bold text-emerald-600">{venue.suitability_score}%</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-6">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Capacity</p>
                <p className="text-lg font-bold text-gray-900">Up to {venue.capacity}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-6">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Setting</p>
                <p className="text-lg font-bold text-gray-900">{venue.indoor_outdoor}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Best For */}
        <Card className="bg-white">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Best For</h2>
            <div className="flex flex-wrap gap-3">
              {venue.suitability_tags.map(tag => (
                <span key={tag} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium border border-emerald-200">
                  {tag}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Location Details */}
        <Card className="bg-white">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Location</h2>
            <p className="text-gray-600 text-lg leading-relaxed flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              {venue.location}
            </p>
          </CardContent>
        </Card>

      </main>
    </div>
  );
}
