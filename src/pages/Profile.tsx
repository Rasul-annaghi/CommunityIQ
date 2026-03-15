import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { useAuth } from '../contexts/AuthContext';
import { getLatestQuizSubmission } from '../lib/quizDb';
import { ArrowLeft, Mail, CheckCircle2, Lock, Star, User as UserIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState<any | null>(null);
  const [profileData, setProfileData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState('Starter');

  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
      // Fetch quiz data
      const { data: qData } = await getLatestQuizSubmission(user.id);
      setQuizData(qData);

      // Fetch profile data
      const { data: pData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setProfileData(pData);
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const displayName = profileData?.full_name || quizData?.answers?.name || user?.email?.split('@')[0] || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  if (loading) {
    return (
      <div className="flex-1 flex flex-col min-h-screen bg-gray-50/50">
        <Header title="Profile" />
        <main className="p-8 flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </main>
      </div>
    );
  }

  const subscriptionPlans = [
    {
      name: 'Starter',
      price: 0,
      description: 'Get started with community insights. Access basic member profiling and segment overview.',
      features: [
        'Member Quiz',
        'Basic Community Segments',
        'Event Recommendations (limited)',
        'Venue Explorer'
      ],
      icon: '🎯',
    },
    {
      name: 'Builder',
      price: 4.99,
      description: 'Build your community with advanced tools. Full access to recommendations and venue matching.',
      features: [
        'Everything in Starter',
        'Full Recommendations',
        'Advanced Venue Matching',
        'Community Insights',
        'History & Analytics',
      ],
      icon: '🏗️',
      popular: true,
    },
    {
      name: 'Pro',
      price: 9.99,
      description: 'Professional community management. Premium support and advanced analytics for scaling communities.',
      features: [
        'Everything in Builder',
        'Premium Support',
        'Advanced Analytics',
        'Custom Segments',
        'Team Collaboration',
        'API Access',
      ],
      icon: '👑',
    },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50/50">
      <Header title="Profile" />
      
      <main className="p-8 space-y-8 max-w-4xl mx-auto w-full">
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* User Profile Card */}
        <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200">
          <CardContent className="p-8">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center text-white text-3xl font-bold">
                {initial}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {displayName}
                </h1>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <Mail className="w-5 h-5" />
                  {user?.email}
                </div>
                <p className="text-gray-700 mb-4">
                  Welcome to CommunityIQ! {quizData ? `You're part of the ${quizData.archetype} segment.` : 'Complete your member quiz to get personalized community recommendations.'}
                </p>
                {quizData && (
                  <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full font-medium text-sm">
                    {quizData.archetype}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card>
          <CardHeader className="bg-gray-50 border-b border-gray-100">
            <CardTitle>About You</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {quizData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Role</p>
                  <p className="text-lg font-semibold text-gray-900">{quizData.answers?.role || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Community Segment</p>
                  <p className="text-lg font-semibold text-gray-900">{quizData.archetype}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Preferred Event Format</p>
                  <p className="text-lg font-semibold text-gray-900">{quizData.answers?.preferredFormat || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Preferred Time</p>
                  <p className="text-lg font-semibold text-gray-900">{quizData.answers?.preferredTime || 'Not specified'}</p>
                </div>
                {quizData.answers?.interests && quizData.answers.interests.length > 0 && (
                  <div className="md:col-span-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Your Interests</p>
                    <div className="flex flex-wrap gap-2">
                      {quizData.answers.interests.map((interest: string) => (
                        <span key={interest} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Complete your member quiz to see detailed profile information.</p>
                <button
                  onClick={() => navigate('/quiz')}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                >
                  Take the Quiz
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subscription Plans */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-500" />
            Subscription Plans
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan) => (
              <Card
                key={plan.name}
                className={`overflow-hidden transition-all ${
                  plan.popular ? 'ring-2 ring-emerald-500 shadow-lg' : ''
                } ${currentPlan === plan.name ? 'border-emerald-500' : ''}`}
              >
                {plan.popular && (
                  <div className="bg-emerald-500 text-white py-2 px-4 text-center font-semibold text-sm">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-8">
                  <div className="text-4xl mb-3">{plan.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    {plan.price > 0 && <span className="text-gray-500 ml-2">/month</span>}
                    {plan.price === 0 && <span className="text-gray-500 ml-2">Forever free</span>}
                  </div>
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">{plan.description}</p>

                  <button
                    className={`w-full py-3 rounded-lg font-medium transition-colors mb-6 ${
                      currentPlan === plan.name
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {currentPlan === plan.name ? 'Current Plan' : 'Choose Plan'}
                  </button>

                  <div className="space-y-3">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Current Plan Info */}
        <Card className="bg-blue-50 border border-blue-200">
          <CardContent className="p-6 flex items-start gap-4">
            <Lock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Security & Privacy</h3>
              <p className="text-sm text-gray-600">
                Your data is encrypted and secure. We never share your information with third parties. 
                For more details, review our privacy policy.
              </p>
            </div>
          </CardContent>
        </Card>

      </main>
    </div>
  );
}
