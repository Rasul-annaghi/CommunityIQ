import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { Card, CardContent } from '../components/Card';
import { getClusterSummaries, getRecommendations } from '../data/engine';
import { Users, Clock, Calendar, DollarSign } from 'lucide-react';

export function Recommendations() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clusters = getClusterSummaries();
  const allRecommendations = getRecommendations();
  const [selectedClusterId, setSelectedClusterId] = useState<string | 'all'>('all');

  useEffect(() => {
    const clusterParam = searchParams.get('cluster');
    if (clusterParam) {
      setSelectedClusterId(clusterParam);
    }
  }, [searchParams]);

  const visibleRecommendations = useMemo(
    () =>
      selectedClusterId === 'all'
        ? allRecommendations
        : allRecommendations.filter((rec) => rec.cluster_id === selectedClusterId),
    [allRecommendations, selectedClusterId],
  );

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50/50">
      <Header title="Event Recommendations" />
      
      <main className="p-8 space-y-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between">
          <p className="text-gray-500">Data-backed event ideas tailored to your community segments.</p>
          <div className="flex gap-2">
            <select
              className="bg-white border border-gray-200 text-sm font-medium text-gray-700 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={selectedClusterId}
              onChange={(e) => setSelectedClusterId(e.target.value as string | 'all')}
            >
              <option value="all">All Segments</option>
              {clusters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-8">
          {visibleRecommendations.map(rec => {
            const cluster = clusters.find(c => c.id === rec.cluster_id);
            return (
              <Card 
                key={rec.id} 
                className="overflow-hidden flex flex-col md:flex-row shadow-sm border border-gray-100 hover:border-emerald-200 transition-all cursor-pointer hover:shadow-md"
                onClick={() => navigate(`/event/${rec.id}`)}
              >
                <div className="md:w-1/3 relative h-64 md:h-auto">
                  <img 
                    src={rec.image} 
                    alt={rec.title} 
                    className="absolute inset-0 w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/90 backdrop-blur text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                      {rec.format}
                    </span>
                  </div>
                </div>
                
                <CardContent className="p-8 md:w-2/3 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cluster?.color }} />
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      Best for {cluster?.name}
                    </span>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">{rec.title}</h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {rec.description}
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{rec.ideal_size}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{rec.ideal_duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{rec.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">${rec.price}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">Why this fits:</h4>
                    <p className="text-sm text-gray-600">{rec.why_this_fits}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
