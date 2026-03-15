import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { getCommunityAverages, getRecommendations, getAllMembers } from '../data/engine';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, PieChart, Pie,
} from 'recharts';
import {
  Sparkles, Brain, Calendar, Send, Loader2, Users, TrendingUp,
  Lightbulb, ClipboardList, ChevronRight, Shield,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const GROQ_API_KEY = (import.meta as any).env.VITE_GROQ_API_KEY || '';

async function callGroq(prompt: string): Promise<string> {
  try {
    const { Groq } = await import('groq-sdk');
    const groq = new Groq({ 
      apiKey: GROQ_API_KEY,
      dangerouslyAllowBrowser: true
    });
    
    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
    });
    
    return response.choices[0]?.message?.content ?? 'No response generated.';
  } catch (err: any) {
    if (!GROQ_API_KEY) {
      return '⚠️ Groq API key not configured. Add VITE_GROQ_API_KEY to your .env.local file to enable AI features.';
    }
    return `Error: ${err.message || 'Failed to generate AI response.'}`;
  }
}

const ROLE_COLORS: Record<string, string> = {
  'Community Builder': '#f59e0b',
  Organizer: '#3b82f6',
  Innovator: '#8b5cf6',
  Supporter: '#10b981',
  Specialist: '#ef4444',
  Participant: '#6b7280',
};

export function PlannerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const defaultCommunity = useMemo(() => getCommunityAverages(), []);
  const recommendations = useMemo(() => getRecommendations(), []);

  const [dynamicCommunity, setDynamicCommunity] = useState(defaultCommunity);

  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [aiIdeas, setAiIdeas] = useState<string | null>(null);
  const [aiAgenda, setAiAgenda] = useState<string | null>(null);
  const [aiInvite, setAiInvite] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [loadingIdeas, setLoadingIdeas] = useState(false);
  const [loadingAgenda, setLoadingAgenda] = useState(false);
  const [loadingInvite, setLoadingInvite] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string>(recommendations[0]?.title ?? '');
  const [liveMemberCount, setLiveMemberCount] = useState<number | null>(null);

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, extraversion, agreeableness, conscientiousness, openness, emotional_stability, community_role, interests', { count: 'exact' })
      .then(({ data, count }: { data: any[] | null; count: number | null }) => {
        if (count != null && count > 0) setLiveMemberCount(count);
        
        const allMembers = getAllMembers();
        let e = 0, a = 0, c = 0, o = 0, s = 0;
        const roles = new Map<string, number>();
        const interestsMap = new Map<string, number>();

        // 1. Seed with mock baseline members (5 default members)
        allMembers.slice(0, 5).forEach(m => {
          e += m.extraversion || 0.5;
          a += m.agreeableness || 0.5;
          c += m.conscientiousness || 0.5;
          o += m.openness || 0.5;
          s += m.emotionalStability || 0.5;

          const role = m.communityRole || 'Participant';
          roles.set(role, (roles.get(role) || 0) + 1);

          if (Array.isArray(m.interests)) {
            m.interests.forEach(int => interestsMap.set(int, (interestsMap.get(int) || 0) + 1));
          }
        });

        // 2. Add dynamic profiles from Supabase
        if (data && data.length > 0) {
          data.forEach(p => {
            e += p.extraversion || 0.5;
            a += p.agreeableness || 0.5;
            c += p.conscientiousness || 0.5;
            o += p.openness || 0.5;
            s += p.emotional_stability || 0.5;

            const role = p.community_role || 'Participant';
            roles.set(role, (roles.get(role) || 0) + 1);

            if (Array.isArray(p.interests)) {
              p.interests.forEach(int => interestsMap.set(int, (interestsMap.get(int) || 0) + 1));
            }
          });
        }

        const total = 5 + (data ? data.length : 0);

        setDynamicCommunity({
          totalMembers: total,
          extraversion: Number((e / total).toFixed(2)),
          agreeableness: Number((a / total).toFixed(2)),
          conscientiousness: Number((c / total).toFixed(2)),
          openness: Number((o / total).toFixed(2)),
          emotionalStability: Number((s / total).toFixed(2)),
          roleDistribution: Array.from(roles.entries())
            .map(([role, rcount]) => ({ role, count: rcount, percent: Math.round((rcount / total) * 100) }))
            .sort((ax, bx) => bx.count - ax.count),
          topInterests: Array.from(interestsMap.entries())
            .map(([name, icount]) => ({ name, count: icount }))
            .sort((ax, bx) => bx.count - ax.count),
        });
      });
  }, []);

  const community = dynamicCommunity;
  const displayMemberCount = community.totalMembers;

  const radarData = [
    { trait: 'Extraversion', value: community.extraversion },
    { trait: 'Agreeableness', value: community.agreeableness },
    { trait: 'Conscientious.', value: community.conscientiousness },
    { trait: 'Openness', value: community.openness },
    { trait: 'Stability', value: community.emotionalStability },
  ];

  const roleData = community.roleDistribution.map((r) => ({
    name: r.role,
    value: r.count,
    percent: r.percent,
    color: ROLE_COLORS[r.role] || '#6b7280',
  }));

  const interestData = community.topInterests.slice(0, 8).map((i) => ({
    name: i.name,
    count: i.count,
  }));

  const rolesText = community.roleDistribution.map((r) => `${r.role}=${r.percent}%`).join(', ');
  const interestsText = community.topInterests.slice(0, 5).map((i) => i.name).join(', ');

  const generateInsight = async () => {
    setLoadingInsight(true);
    const prompt = `You are a community manager assistant. Analyze this community's profile and suggest the best event focus:
Roles distribution: ${rolesText}.
Top interests: ${interestsText}.
Total members: ${community.totalMembers}.
Big Five averages: Extraversion=${community.extraversion}, Agreeableness=${community.agreeableness}, Conscientiousness=${community.conscientiousness}, Openness=${community.openness}, Emotional Stability=${community.emotionalStability}.
Summarize what types of events and activities will engage this community most. Be specific and actionable. Write 2-3 paragraphs.`;
    const result = await callGroq(prompt);
    setAiInsight(result);
    setLoadingInsight(false);
  };

  const generateIdeas = async () => {
    setLoadingIdeas(true);
    const prompt = `Generate 3 community event ideas suitable for this community:
Community profile:
- Size: ${community.totalMembers} members
- Top Roles: ${rolesText}
- Top interests: ${interestsText}
- Big Five averages: E=${community.extraversion}, A=${community.agreeableness}, C=${community.conscientiousness}, O=${community.openness}, S=${community.emotionalStability}
Provide for each event: title, short description, target audience (roles), suggested duration, and energy level. Format with numbered list and bold titles.`;
    const result = await callGroq(prompt);
    setAiIdeas(result);
    setLoadingIdeas(false);
  };

  const generateAgenda = async () => {
    setLoadingAgenda(true);
    const prompt = `Create a detailed plan for the event "${selectedEvent}":
Community size: ${community.totalMembers} members. Include:
1. Full agenda with time slots
2. Required resources (rooms, equipment, etc.)
3. Staff/volunteer roles needed
4. Promotion ideas (social media, email)
5. Success metrics to track
Format with clear headings and bullet points.`;
    const result = await callGroq(prompt);
    setAiAgenda(result);
    setLoadingAgenda(false);
  };

  const generateInvite = async () => {
    setLoadingInvite(true);
    const prompt = `Write an invitation text to send to potential attendees for the "${selectedEvent}" event. Highlight key benefits, include emojis, and add a clear RSVP call-to-action. Make it engaging and concise (under 150 words). Also include a subject line.`;
    const result = await callGroq(prompt);
    setAiInvite(result);
    setLoadingInvite(false);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50/50">
      <Header title="Planner Dashboard" />

      <main className="p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Top Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-6 h-6" />
            <span className="text-sm font-semibold uppercase tracking-wider opacity-80">Organizer Tools</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Community Intelligence Hub</h2>
          <p className="text-indigo-100 max-w-2xl">
            Use AI-powered insights to understand your community, generate event ideas, plan agendas, and craft invitation copy — all from one dashboard.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">{displayMemberCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Community Roles</p>
                <p className="text-2xl font-bold text-gray-900">{community.roleDistribution.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Lightbulb className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Top Interest</p>
                <p className="text-2xl font-bold text-gray-900">{community.topInterests[0]?.name ?? 'N/A'}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Events Ready</p>
                <p className="text-2xl font-bold text-gray-900">{recommendations.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Community Pulse: Radar + Roles + Interests */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Big Five Radar */}
          <Card>
            <CardHeader className="border-b border-gray-100 py-5 px-6">
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-600" /> Community Personality
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e0e7ff" />
                    <PolarAngleAxis dataKey="trait" tick={{ fill: '#6366f1', fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 1]} tick={false} axisLine={false} />
                    <Radar name="Community" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Role Distribution */}
          <Card>
            <CardHeader className="border-b border-gray-100 py-5 px-6">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-600" /> Role Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-48 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={roleData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%" cy="50%"
                      outerRadius={70}
                      label={({ name, percent }) => `${name} ${percent}%`}
                      labelLine={false}
                    >
                      {roleData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {roleData.map((r) => (
                  <div key={r.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: r.color }} />
                      <span className="text-gray-700">{r.name}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{r.value} ({r.percent}%)</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Interests */}
          <Card>
            <CardHeader className="border-b border-gray-100 py-5 px-6">
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-emerald-600" /> Top Interests
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={interestData} layout="vertical" margin={{ left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} width={90} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#6366f1" radius={[0, 6, 6, 0]} maxBarSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600" /> AI-Powered Tools
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Community Insights */}
            <Card className="border-indigo-100">
              <CardHeader className="border-b border-indigo-50 py-5 px-6 bg-indigo-50/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="w-5 h-5 text-indigo-600" /> Community Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-sm text-gray-600 mb-4">
                  Generate an AI-powered summary of your community's personality profile and event preferences.
                </p>
                <button
                  onClick={generateInsight}
                  disabled={loadingInsight}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium py-2.5 px-6 rounded-xl transition-colors shadow-sm text-sm"
                >
                  {loadingInsight ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {loadingInsight ? 'Analyzing...' : 'Generate Insights'}
                </button>
                {aiInsight === "⚠️ Groq API key not configured. Add VITE_GROQ_API_KEY to your .env.local file to enable AI features." ? (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-2">
                    <span className="text-amber-600 text-lg leading-none">⚠️</span>
                    <p className="text-sm text-amber-700">
                      ⚠️ Groq API key not configured. Add <code className="bg-amber-100 px-1 rounded">VITE_GROQ_API_KEY</code> to your .env.local file to enable AI features.
                    </p>
                  </div>
                ) : aiInsight ? (
                  <div className="mt-4 rounded-xl bg-gray-50 border border-gray-100 p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {aiInsight}
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {/* AI Event Ideas */}
            <Card className="border-violet-100">
              <CardHeader className="border-b border-violet-50 py-5 px-6 bg-violet-50/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-violet-600" /> Event Ideas
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-sm text-gray-600 mb-4">
                  Generate 3 tailored event ideas based on your community's personality and interests.
                </p>
                <button
                  onClick={generateIdeas}
                  disabled={loadingIdeas}
                  className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-medium py-2.5 px-6 rounded-xl transition-colors shadow-sm text-sm"
                >
                  {loadingIdeas ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-4 h-4" />}
                  {loadingIdeas ? 'Generating...' : 'Generate 3 Ideas'}
                </button>
                {aiIdeas === "⚠️ Groq API key not configured. Add VITE_GROQ_API_KEY to your .env.local file to enable AI features." ? (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-2">
                    <span className="text-amber-600 text-lg leading-none">⚠️</span>
                    <p className="text-sm text-amber-700">
                      ⚠️ Groq API key not configured. Add <code className="bg-amber-100 px-1 rounded">VITE_GROQ_API_KEY</code> to your .env.local file to enable AI features.
                    </p>
                  </div>
                ) : aiIdeas ? (
                  <div className="mt-4 rounded-xl bg-gray-50 border border-gray-100 p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {aiIdeas}
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {/* AI Event Planner */}
            <Card className="border-emerald-100">
              <CardHeader className="border-b border-emerald-50 py-5 px-6 bg-emerald-50/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-emerald-600" /> Event Planner
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-sm text-gray-600 mb-4">
                  Select an event and generate a full agenda with resources, roles, and promotion plan.
                </p>
                <select
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm mb-4 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  {recommendations.map((rec) => (
                    <option key={rec.id} value={rec.title}>{rec.title}</option>
                  ))}
                </select>
                <button
                  onClick={generateAgenda}
                  disabled={loadingAgenda}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-medium py-2.5 px-6 rounded-xl transition-colors shadow-sm text-sm"
                >
                  {loadingAgenda ? <Loader2 className="w-4 h-4 animate-spin" /> : <ClipboardList className="w-4 h-4" />}
                  {loadingAgenda ? 'Planning...' : 'Generate Full Plan'}
                </button>
                {aiAgenda === "⚠️ Groq API key not configured. Add VITE_GROQ_API_KEY to your .env.local file to enable AI features." ? (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-2">
                    <span className="text-amber-600 text-lg leading-none">⚠️</span>
                    <p className="text-sm text-amber-700">
                      ⚠️ Groq API key not configured. Add <code className="bg-amber-100 px-1 rounded">VITE_GROQ_API_KEY</code> to your .env.local file to enable AI features.
                    </p>
                  </div>
                ) : aiAgenda ? (
                  <div className="mt-4 rounded-xl bg-gray-50 border border-gray-100 p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                    {aiAgenda}
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {/* AI Invitation Copy */}
            <Card className="border-amber-100">
              <CardHeader className="border-b border-amber-50 py-5 px-6 bg-amber-50/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Send className="w-5 h-5 text-amber-600" /> Invitation Copy
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-sm text-gray-600 mb-4">
                  Generate an engaging RSVP/invite text for the selected event.
                </p>
                <button
                  onClick={generateInvite}
                  disabled={loadingInvite}
                  className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white font-medium py-2.5 px-6 rounded-xl transition-colors shadow-sm text-sm"
                >
                  {loadingInvite ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {loadingInvite ? 'Writing...' : 'Generate Invite'}
                </button>
                {aiInvite === "⚠️ Groq API key not configured. Add VITE_GROQ_API_KEY to your .env.local file to enable AI features." ? (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-2">
                    <span className="text-amber-600 text-lg leading-none">⚠️</span>
                    <p className="text-sm text-amber-700">
                      ⚠️ Groq API key not configured. Add <code className="bg-amber-100 px-1 rounded">VITE_GROQ_API_KEY</code> to your .env.local file to enable AI features.
                    </p>
                  </div>
                ) : aiInvite ? (
                  <div className="mt-4 rounded-xl bg-gray-50 border border-gray-100 p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {aiInvite}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Existing Events */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-600" /> Upcoming Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec) => (
              <Card 
                key={rec.id} 
                className="overflow-hidden hover:shadow-lg hover:border-indigo-200 transition-all cursor-pointer"
                onClick={() => navigate(`/event/${rec.id}`)}
              >
                <div className="h-40 relative">
                  <img
                    src={rec.image}
                    alt={rec.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur text-white text-xs font-bold uppercase tracking-wider">
                      {rec.format}
                    </span>
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-bold text-gray-900 mb-1">{rec.title}</h3>
                  <p className="text-xs text-gray-500 mb-3">{rec.date} • {rec.ideal_size} attendees</p>
                  <div className="flex flex-wrap gap-1.5">
                    {rec.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
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
