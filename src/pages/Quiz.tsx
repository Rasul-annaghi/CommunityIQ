import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationsContext';
import { getClusterById, getRecommendationForCluster, inferClusterId } from '../data/engine';
import type { Member } from '../data/mockData';
import { saveQuizSubmission, getLatestQuizSubmission, updateProfileFullName } from '../lib/quizDb';

export function Quiz() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [introExtro, setIntroExtro] = useState(3);
  const [creativeTechnical, setCreativeTechnical] = useState(3);
  const [collaboration, setCollaboration] = useState(3);
  const [interests, setInterests] = useState<string[]>([]);
  const [preferredFormat, setPreferredFormat] = useState<string | null>(null);
  const [preferredTime, setPreferredTime] = useState('Evening');
  const [resultClusterName, setResultClusterName] = useState<string | null>(null);
  const [resultEventTitle, setResultEventTitle] = useState<string | null>(null);
  const [resultEventWhy, setResultEventWhy] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [alreadyCompleted, setAlreadyCompleted] = useState<{ archetype: string; answers: unknown } | null>(null);
  const [checkingExisting, setCheckingExisting] = useState(true);

  const interestOptions = ['Design', 'Coding', 'Startups', 'Marketing', 'Data', 'Writing', 'Leadership', 'Art'];
  const formatOptions = ['Workshop', 'Hackathon', 'Mixer', 'Study Group'];
  const timeOptions = ['Weekend', 'Evening', 'Weekday Morning'];

  useEffect(() => {
    if (!user) return;
    getLatestQuizSubmission(user.id).then(({ data }) => {
      setCheckingExisting(false);
      if (data) {
        setAlreadyCompleted({
          archetype: data.archetype,
          answers: data.answers,
        });
      }
    });
  }, [user]);

  const toggleInterest = (tag: string) => {
    setInterests((prev) => {
      if (prev.includes(tag)) return prev.filter((t) => t !== tag);
      if (prev.length >= 3) return prev;
      return [...prev, tag];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitError(null);
    setSaving(true);

    const answers = {
      name: name.trim(),
      role: role || 'Member',
      introExtroScore: introExtro,
      creativeTechnicalScore: creativeTechnical,
      collaborationScore: collaboration,
      interests,
      preferredFormat: preferredFormat ?? 'Workshop',
      preferredTime,
    };

    const member: Member = {
      id: user.id,
      name: answers.name,
      role: answers.role,
      intro_extro_score: introExtro,
      creative_technical_score: creativeTechnical,
      collaboration_score: collaboration,
      interests,
      preferred_format: answers.preferredFormat,
      preferred_time: answers.preferredTime,
    };

    const clusterId = inferClusterId(member);
    const cluster = getClusterById(clusterId);
    const recommendation = getRecommendationForCluster(clusterId);
    const archetypeName = cluster?.name ?? clusterId;

    await updateProfileFullName(user.id, answers.name);

    const { error } = await saveQuizSubmission(user.id, answers, archetypeName);

    setSaving(false);
    if (error) {
      setSubmitError(error.message || 'Failed to save. Please try again.');
      return;
    }

    setResultClusterName(archetypeName);
    setResultEventTitle(recommendation?.title ?? null);
    setResultEventWhy(recommendation?.why_this_fits ?? null);

    // Add notification
    addNotification({
      type: 'quiz',
      title: 'Quiz Completed!',
      message: `You've been assigned to ${archetypeName}. Check your personalized recommendations!`,
      icon: '🎯',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    });
    setSubmitted(true);
  };

  if (checkingExisting) {
    return (
      <div className="flex-1 flex flex-col min-h-screen bg-gray-50/50">
        <Header title="Member Onboarding" />
        <main className="p-8 flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
            <p className="text-sm text-gray-500">Loading your profile…</p>
          </div>
        </main>
      </div>
    );
  }

  if (alreadyCompleted && !submitted) {
    return (
      <div className="flex-1 flex flex-col min-h-screen bg-gray-50/50">
        <Header title="Member Onboarding" />
        <main className="p-8 flex-1 flex items-center justify-center">
          <Card className="text-center p-12 bg-white max-w-lg w-full">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">You’ve already completed the quiz</h2>
            <p className="text-gray-600 mb-6">
              Your community segment: <span className="font-semibold text-emerald-700">{alreadyCompleted.archetype}</span>
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-8 rounded-xl transition-colors shadow-sm"
            >
              Go to Dashboard
            </button>
            <button
              type="button"
              onClick={() => setAlreadyCompleted(null)}
              className="mt-4 text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              Submit again (new response)
            </button>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50/50">
      <Header title="Member Onboarding" />

      <main className="p-8 flex-1 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          {submitted ? (
            <Card className="text-center p-12 bg-white">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">You’re all set!</h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Your preferences are saved. Organizers can use this to plan events that fit you.
              </p>

              {resultClusterName && (
                <div className="mb-8 text-left max-w-lg mx-auto rounded-2xl border border-emerald-100 bg-emerald-50/60 px-6 py-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                      Your community profile
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    You match the <span className="text-emerald-700">{resultClusterName}</span> segment.
                  </p>
                  {resultEventTitle && (
                    <p className="text-sm text-gray-700 mb-1">
                      Ideal next event: <span className="font-medium text-gray-900">{resultEventTitle}</span>
                    </p>
                  )}
                  {resultEventWhy && (
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">{resultEventWhy}</p>
                  )}
                </div>
              )}

              <button
                onClick={() => navigate('/')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-8 rounded-xl transition-colors shadow-sm"
              >
                Go to Dashboard
              </button>
            </Card>
          ) : (
            <Card className="bg-white shadow-sm border border-gray-100">
              <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-6 px-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-emerald-600 uppercase tracking-wider">
                    Step {step} of 3
                  </span>
                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 w-8 rounded-full ${i <= step ? 'bg-emerald-500' : 'bg-gray-200'}`}
                      />
                    ))}
                  </div>
                </div>
                <CardTitle className="text-2xl">Help us plan better events</CardTitle>
                <p className="text-gray-500 mt-1">Tell us a bit about how you like to engage.</p>
              </CardHeader>

              <CardContent className="p-8">
                <form
                  onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); setStep((s) => s + 1); }}
                  className="space-y-6"
                >
                  {submitError && (
                    <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                      {submitError}
                    </div>
                  )}

                  {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">What's your name?</label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                          placeholder="Jane Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">What's your primary role?</label>
                        <select
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none bg-white"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                        >
                          <option value="">Select a role...</option>
                          <option value="designer">Designer</option>
                          <option value="developer">Developer</option>
                          <option value="pm">Product Manager</option>
                          <option value="marketing">Marketing</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-4">How do you prefer to interact?</label>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm text-gray-500 font-medium w-24 text-right">Quiet / Solo</span>
                          <input
                            type="range"
                            min="1"
                            max="5"
                            value={introExtro}
                            onChange={(e) => setIntroExtro(Number(e.target.value))}
                            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                          />
                          <span className="text-sm text-gray-500 font-medium w-24">Social / Group</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-4">What kind of work energizes you?</label>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm text-gray-500 font-medium w-24 text-right">Creative</span>
                          <input
                            type="range"
                            min="1"
                            max="5"
                            value={creativeTechnical}
                            onChange={(e) => setCreativeTechnical(Number(e.target.value))}
                            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                          />
                          <span className="text-sm text-gray-500 font-medium w-24">Technical</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-4">How do you tackle projects?</label>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm text-gray-500 font-medium w-24 text-right">Independent</span>
                          <input
                            type="range"
                            min="1"
                            max="5"
                            value={collaboration}
                            onChange={(e) => setCollaboration(Number(e.target.value))}
                            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                          />
                          <span className="text-sm text-gray-500 font-medium w-24">Collaborative</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-3">Select your top interests (up to 3)</label>
                        <div className="flex flex-wrap gap-2">
                          {interestOptions.map((tag) => (
                            <label key={tag} className="cursor-pointer">
                              <input
                                type="checkbox"
                                className="peer sr-only"
                                checked={interests.includes(tag)}
                                onChange={() => toggleInterest(tag)}
                              />
                              <div className="px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-600 peer-checked:bg-emerald-50 peer-checked:text-emerald-700 peer-checked:border-emerald-200 transition-colors">
                                {tag}
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-3">Preferred event format</label>
                        <div className="grid grid-cols-2 gap-3">
                          {formatOptions.map((format) => (
                            <label key={format} className="cursor-pointer">
                              <input
                                type="radio"
                                name="format"
                                className="peer sr-only"
                                checked={preferredFormat === format}
                                onChange={() => setPreferredFormat(format)}
                              />
                              <div className="px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 text-center peer-checked:bg-emerald-50 peer-checked:text-emerald-700 peer-checked:border-emerald-500 peer-checked:ring-1 peer-checked:ring-emerald-500 transition-all">
                                {format}
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-3">When do you usually attend events?</label>
                        <div className="grid grid-cols-3 gap-3">
                          {timeOptions.map((option) => (
                            <label key={option} className="cursor-pointer">
                              <input
                                type="radio"
                                name="time"
                                className="peer sr-only"
                                checked={preferredTime === option}
                                onChange={() => setPreferredTime(option)}
                              />
                              <div className="px-3 py-3 rounded-xl border border-gray-200 text-xs sm:text-sm font-medium text-gray-700 text-center peer-checked:bg-emerald-50 peer-checked:text-emerald-700 peer-checked:border-emerald-500 peer-checked:ring-1 peer-checked:ring-emerald-500 transition-all">
                                {option}
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-10 flex items-center justify-between pt-6 border-t border-gray-100">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={() => setStep((s) => s - 1)}
                        className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        Back
                      </button>
                    ) : (
                      <div />
                    )}
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-gray-900 hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2.5 px-8 rounded-xl transition-colors shadow-sm ml-auto flex items-center gap-2"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving…
                        </>
                      ) : step === 3 ? (
                        'Submit Profile'
                      ) : (
                        'Continue'
                      )}
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
