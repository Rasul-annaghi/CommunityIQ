import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Card, CardContent } from '../components/Card';
import { getClusterSummaries, getRecommendations } from '../data/engine';
import { ArrowLeft, MapPin, Users, Clock, DollarSign, User, Calendar } from 'lucide-react';

export function EventDetails() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const allRecommendations = getRecommendations();
  const clusters = getClusterSummaries();
  
  const event = allRecommendations.find(rec => rec.id === eventId);
  const cluster = event ? clusters.find(c => c.id === event.cluster_id) : null;

  if (!event || !cluster) {
    return <div className="flex-1 p-8">Event not found</div>;
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50/50">
      <Header title={event.title} />
      
      <main className="p-8 space-y-8 max-w-4xl mx-auto w-full">
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/recommendations')}
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Recommendations
        </button>

        {/* Hero Image */}
        <div className="relative h-96 rounded-3xl overflow-hidden shadow-lg border border-gray-100">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
          <div className="absolute bottom-6 left-8 right-8">
            <span className="px-4 py-2 rounded-full bg-emerald-500/90 backdrop-blur text-white text-sm font-bold uppercase tracking-wider shadow-md">
              {event.format}
            </span>
          </div>
        </div>

        {/* Event Title and Summary */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cluster.color }} />
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Best for {cluster.name}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
          <p className="text-lg text-gray-600 leading-relaxed">{event.description}</p>
        </div>

        {/* Key Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-emerald-600 mt-1" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Date</p>
                  <p className="text-lg font-bold text-gray-900">{event.date}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-emerald-600 mt-1" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Duration</p>
                  <p className="text-lg font-bold text-gray-900">{event.ideal_duration}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-emerald-600 mt-1" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Group Size</p>
                  <p className="text-lg font-bold text-gray-900">{event.ideal_size}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-emerald-600 mt-1" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Price</p>
                  <p className="text-lg font-bold text-gray-900">${event.price}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Address and Host */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wider">Location</h3>
                  <p className="text-gray-600">{event.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wider">Event Host</h3>
                  <p className="text-gray-600">{event.host}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Why This Fits */}
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-50/50 border border-emerald-200/50">
          <CardContent className="p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Why this fits:</h3>
            <p className="text-gray-700 leading-relaxed text-base">{event.why_this_fits}</p>
          </CardContent>
        </Card>

        {/* Event Details - Table of Contents */}
        <Card className="bg-white">
          <CardContent className="p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">What to expect:</h3>
            <div className="space-y-3">
              {event.details.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-bold text-emerald-600">{idx + 1}</span>
                  </div>
                  <p className="text-gray-700 pt-0.5">{detail}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Buy Ticket Button */}
        <div className="flex justify-center pt-4">
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-12 rounded-xl transition-colors shadow-lg text-lg">
            Buy Ticket
          </button>
        </div>

        {/* Spacer */}
        <div className="h-8" />
      </main>
    </div>
  );
}
