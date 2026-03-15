import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Card, CardContent } from '../components/Card';
import { getClusterSummaries, getRecommendations, getTopVenues, getAllMembers } from '../data/engine';
import { ArrowRight, Users, Activity, Target, MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function Dashboard() {
  const navigate = useNavigate();
  const clusters = getClusterSummaries();
  const topRecommendations = getRecommendations().slice(0, 2);
  const venues = getTopVenues();
  const members = getAllMembers();
  const totalMembers = members.length;
  const chartData = clusters.map(c => ({ name: c.name, size: c.size, color: c.color }));

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

        {/* Segments & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Segment List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Community Segments</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {clusters.map(cluster => (
                <Card 
                  key={cluster.id} 
                  onClick={() => navigate(`/recommendations?cluster=${cluster.id}`)}
                  className="hover:border-emerald-200 transition-all cursor-pointer group hover:shadow-md"
                >
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cluster.color }} />
                        <h4 className="font-semibold text-gray-900">{cluster.name}</h4>
                      </div>
                      <span className="text-sm font-medium text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg">
                        {cluster.size} members
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{cluster.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {cluster.dominant_interests.slice(0, 2).map(interest => (
                        <span key={interest} className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Distribution</h2>
            <Card className="h-[340px] flex flex-col">
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                      <Tooltip 
                        cursor={{ fill: '#f9fafb' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="size" radius={[6, 6, 0, 0]} maxBarSize={40}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>

        {/* Venue Suggestions */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Top Venue Matches</h2>
            <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors">
              Explore map <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {venues.map(venue => (
              <Card key={venue.id} className="group cursor-pointer hover:shadow-md transition-all">
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
