import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Card, CardContent } from '../components/Card';
import { getClusterSummaries, getRecommendations, getTopVenues, getAllMembers } from '../data/engine';
import { ArrowRight, Users, Activity, Target, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Dashboard() {
  const navigate = useNavigate();
  const clusters = getClusterSummaries();
  const topRecommendations = getRecommendations().slice(0, 2);
  const venues = getTopVenues();
  const members = getAllMembers();
  const [totalMembers, setTotalMembers] = useState(members.length);

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .then(({ count }) => {
        setTotalMembers(members.length + (count || 0));
      });
  }, []);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50/50">
      <Header title="Overview" />
      
      <main className="p-8 space-y-8 max-w-7xl mx-auto w-full">
        
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">{totalMembers}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Active Segments</p>
                <p className="text-2xl font-bold text-gray-900">{clusters.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Avg Engagement</p>
                <p className="text-2xl font-bold text-gray-900">78%</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Venues Matched</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hero Recommendations */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Top Event Recommendations</h2>
            <button 
              onClick={() => navigate('/recommendations')}
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors cursor-pointer"
            >
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {topRecommendations.map((rec, idx) => {
              const cluster = clusters.find(c => c.id === rec.cluster_id);
              return (
                <div 
                  key={rec.id} 
                  onClick={() => navigate(`/event/${rec.id}`)}
                  className="relative group overflow-hidden rounded-3xl aspect-[16/9] shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg hover:border-emerald-200 transition-all"
                >
                  <img 
                    src={rec.image} 
                    alt={rec.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent" />
                  
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium border border-white/10">
                        For {cluster?.name}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/80 backdrop-blur-md text-white text-xs font-medium border border-emerald-400/20">
                        {rec.format}
                      </span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">{rec.title}</h3>
                    <p className="text-gray-200 text-sm max-w-md mb-6 line-clamp-2">
                      {rec.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-300">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" /> {rec.ideal_size}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Activity className="w-4 h-4" /> {rec.energy_level}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Venue Suggestions */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Top Venue Matches</h2>
            <button 
              onClick={() => navigate('/venues')}
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors cursor-pointer"
            >
              Explore map <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {venues.map(venue => (
              <Card 
                key={venue.id} 
                className="group cursor-pointer hover:shadow-md transition-all"
                onClick={() => navigate(`/venue/${venue.id}`)}
              >
                <div className="h-32 overflow-hidden relative">
                  <img 
                    src={venue.image} 
                    alt={venue.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold text-emerald-600 shadow-sm">
                    {venue.suitability_score}% Match
                  </div>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-1 truncate">{venue.name}</h4>
                  <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {venue.location} • {venue.capacity} cap
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {venue.suitability_tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[10px] font-medium text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
