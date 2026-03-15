import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { getClusterSummaries } from '../data/engine';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

export function Insights() {
  const navigate = useNavigate();
  const clusters = getClusterSummaries();
  const chartData = clusters.map(c => ({ name: c.name, size: c.size, color: c.color }));

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50/50">
      <Header title="Community Insights" />
      
      <main className="p-8 space-y-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between">
          <p className="text-gray-500">Deep dive into the traits and preferences of your community segments.</p>
        </div>

        {/* Distribution Chart */}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {clusters.map(cluster => {
            const radarData = [
              { subject: 'Extroversion', A: cluster.avg_intro_extro, fullMark: 5 },
              { subject: 'Technical', A: cluster.avg_creative_technical, fullMark: 5 },
              { subject: 'Collaboration', A: cluster.avg_collaboration, fullMark: 5 },
            ];

            return (
              <Card key={cluster.id} className="overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:border-emerald-200 hover:shadow-md transition-all" onClick={() => navigate(`/recommendations?cluster=${cluster.id}`)}>
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-6 px-8 flex flex-row items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cluster.color }} />
                      <CardTitle className="text-2xl">{cluster.name}</CardTitle>
                    </div>
                    <p className="text-gray-500 text-sm">{cluster.size} members</p>
                  </div>
                  <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                    View Members
                  </button>
                </CardHeader>
                
                <CardContent className="p-8">
                  <p className="text-gray-600 mb-8 leading-relaxed">{cluster.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                          <PolarGrid stroke="#e5e7eb" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                          <Radar name={cluster.name} dataKey="A" stroke={cluster.color} fill={cluster.color} fillOpacity={0.4} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">Dominant Interests</h4>
                        <div className="flex flex-wrap gap-2">
                          {cluster.dominant_interests.map(interest => (
                            <span key={interest} className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">Event Preferences</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Format</span>
                            <span className="font-medium text-gray-900">{cluster.recommended_event_type}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Group Size</span>
                            <span className="font-medium text-gray-900">{cluster.recommended_group_size}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Timing</span>
                            <span className="font-medium text-gray-900">{cluster.recommended_time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
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
