import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { useAuth } from '../contexts/AuthContext';
import { getLatestQuizSubmission } from '../lib/quizDb';
import { getRecommendations, getTopVenues } from '../data/engine';
import { CheckCircle2, Sparkles, MapPin, Clock, Users, Calendar, ArrowRight } from 'lucide-react';
import type { EventRecommendation, Venue } from '../data/mockData';

export function History() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quizHistory, setQuizHistory] = useState<any | null>(null);
  const [bookedEvents, setBookedEvents] = useState<EventRecommendation[]>([]);
  const [visitedVenues, setVisitedVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchHistory = async () => {
      // Fetch quiz history
      const { data: quizData } = await getLatestQuizSubmission(user.id);
      setQuizHistory(quizData);

      // Mock booked events (in a real app, this would come from a database)
      const allRecommendations = getRecommendations();
      const booked = allRecommendations.slice(0, 2); // Mock: first 2 recommendations as booked
      setBookedEvents(booked);

      // Mock visited venues (in a real app, this would come from a database)
      const allVenues = getTopVenues();
      const visited = allVenues.slice(0, 2); // Mock: first 2 venues as visited
      setVisitedVenues(visited);

      setLoading(false);
    };

    fetchHistory();
  }, [user]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col min-h-screen bg-gray-50/50">
        <Header title="History" />
        <main className="p-8 flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50/50">
      <Header title="History" />
      
      <main className="p-8 space-y-12 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between">
          <p className="text-gray-500">Keep track of your community journey - quizzes taken, events attended, and venues visited.</p>
        </div>

        {/* Member Quiz History */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            Member Quiz History
          </h2>
          
          {quizHistory ? (
            <div className="space-y-4">
              <Card className="bg-white border border-emerald-200 shadow-sm">
                <CardHeader className="bg-emerald-50 border-b border-emerald-100 py-6 px-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl text-emerald-900">{quizHistory.archetype}</CardTitle>
                      <p className="text-sm text-emerald-700 mt-1">Completed on {new Date(quizHistory.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Your Community Segment</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Personality Type</p>
                      <p className="text-lg font-bold text-gray-900">{quizHistory.archetype}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Format</p>
                      <p className="text-lg font-bold text-gray-900">{quizHistory.answers?.preferredFormat || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Preferred Time</p>
                      <p className="text-lg font-bold text-gray-900">{quizHistory.answers?.preferredTime || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Interests</p>
                      <div className="flex flex-wrap gap-1.5">
                        {quizHistory.answers?.interests?.slice(0, 2).map((interest: string) => (
                          <span key={interest} className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="bg-gray-50 border border-dashed border-gray-300">
              <CardContent className="p-12 text-center">
                <p className="text-gray-500 mb-4">You haven't completed the member quiz yet.</p>
                <button
                  onClick={() => navigate('/quiz')}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                >
                  Take the Quiz
                </button>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Booked Events */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            Events with Purchased Tickets
          </h2>
          
          {bookedEvents.length > 0 ? (
            <div className="space-y-6">
              {bookedEvents.map(event => (
                <Card
                  key={event.id}
                  className="overflow-hidden flex flex-col md:flex-row shadow-sm border border-gray-100 hover:border-blue-200 transition-all cursor-pointer hover:shadow-md"
                  onClick={() => navigate(`/event/${event.id}`)}
                >
                  <div className="md:w-1/3 relative h-64 md:h-auto">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="px-3 py-1 rounded-full bg-blue-500/90 backdrop-blur text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                        {event.format}
                      </span>
                    </div>
                  </div>
                  
                  <CardContent className="p-8 md:w-2/3 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">{event.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{event.description}</p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{event.ideal_duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{event.ideal_size}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                      <span className="text-sm font-medium text-gray-500">${event.price}</span>
                      <div className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                        View Details <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-gray-50 border border-dashed border-gray-300">
              <CardContent className="p-12 text-center">
                <p className="text-gray-500 mb-4">You haven't booked any events yet.</p>
                <button
                  onClick={() => navigate('/recommendations')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Explore Events
                </button>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Visited Venues */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-amber-600" />
            </div>
            Venues Visited
          </h2>
          
          {visitedVenues.length > 0 ? (
            <div className="space-y-6">
              {visitedVenues.map(venue => (
                <Card
                  key={venue.id}
                  className="overflow-hidden flex flex-col md:flex-row shadow-sm border border-gray-100 hover:border-amber-200 transition-all cursor-pointer hover:shadow-md"
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
                      <span className="px-3 py-1 rounded-full bg-amber-500/90 backdrop-blur text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                        {venue.type}
                      </span>
                    </div>
                  </div>
                  
                  <CardContent className="p-8 md:w-2/3 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">{venue.name}</h3>
                    
                    <div className="flex items-center gap-6 mb-6">
                      <span className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-5 h-5 text-amber-600" /> {venue.location}
                      </span>
                      <span className="flex items-center gap-2 text-gray-600">
                        <Users className="w-5 h-5 text-amber-600" /> Up to {venue.capacity}
                      </span>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Great For</h4>
                      <div className="flex flex-wrap gap-2">
                        {venue.suitability_tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                      <span className="text-sm font-medium text-gray-500">{venue.indoor_outdoor}</span>
                      <div className="flex items-center gap-2 text-amber-600 hover:text-amber-700">
                        View Details <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-gray-50 border border-dashed border-gray-300">
              <CardContent className="p-12 text-center">
                <p className="text-gray-500 mb-4">You haven't visited any venues yet.</p>
                <button
                  onClick={() => navigate('/venues')}
                  className="px-6 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
                >
                  Explore Venues
                </button>
              </CardContent>
            </Card>
          )}
        </section>

      </main>
    </div>
  );
}
