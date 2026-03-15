import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { CheckCircle2, Sparkles, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationsContext';
import { saveQuizSubmission, getLatestQuizSubmission, updateProfileFullName } from '../lib/quizDb';
import {
  QUIZ_QUESTIONS,
  LIKERT_LABELS,
  scoreBigFive,
  mapCommunityRole,
  ROLE_DESCRIPTIONS,
  type BigFiveScores,
  type CommunityRole,
} from '../data/bigFiveQuiz';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
} from 'recharts';

const QUESTIONS_PER_PAGE = 4;
const TOTAL_QUIZ_PAGES = Math.ceil(QUIZ_QUESTIONS.length / QUESTIONS_PER_PAGE);
const TOTAL_STEPS = 1 + TOTAL_QUIZ_PAGES + 1; // intro + quiz pages + interests

export function Quiz() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  // Step: 1 = name/role, 2..5 = quiz questions, 6 = interests/format
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [likertAnswers, setLikertAnswers] = useState<Record<number, number>>({});
  const [interests, setInterests] = useState<string[]>([]);
  const [preferredFormat, setPreferredFormat] = useState<string | null>(null);
  const [preferredTime, setPreferredTime] = useState('Evening');

  const [resultRole, setResultRole] = useState<CommunityRole | null>(null);
  const [resultScores, setResultScores] = useState<BigFiveScores | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [alreadyCompleted, setAlreadyCompleted] = useState<{ archetype: string; answers: unknown } | null>(null);
  const [checkingExisting, setCheckingExisting] = useState(true);
  const [consentChecked, setConsentChecked] = useState(false);

  const interestOptions = [
    'AI', 'Startups', 'Design', 'Coding', 'Data Science',
    'Marketing', 'Leadership', 'Community', 'Hackathons', 'Mobile Dev',
    'Open Source', 'Cloud/DevOps', 'UX Research', 'Blockchain',
  ];
  const formatOptions = ['Workshop', 'Hackathon', 'Mixer', 'Study Group', 'Pitch Night', 'Seminar'];
  const timeOptions = ['Weekend', 'Evening', 'Weekday Morning'];

  useEffect(() => {
    if (!user) return;
    getLatestQuizSubmission(user.id).then(({ data }) => {
      setCheckingExisting(false);
      if (data) {
        setAlreadyCompleted({ archetype: data.archetype, answers: data.answers });
      }
    });
  }, [user]);

  const toggleInterest = (tag: string) => {
    setInterests((prev) => {
      if (prev.includes(tag)) return prev.filter((t) => t !== tag);
      if (prev.length >= 5) return prev;
      return [...prev, tag];
    });
  };

  const setLikertAnswer = (questionId: number, value: number) => {
    setLikertAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const isQuizStep = step >= 2 && step <= 1 + TOTAL_QUIZ_PAGES;
  const quizPageIndex = step - 2; // 0-based
  const currentQuestions = isQuizStep
    ? QUIZ_QUESTIONS.slice(quizPageIndex * QUESTIONS_PER_PAGE, (quizPageIndex + 1) * QUESTIONS_PER_PAGE)
    : [];
  const allQuestionsAnswered = isQuizStep
    ? currentQuestions.every((q) => likertAnswers[q.id] !== undefined)
    : true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!consentChecked) {
      setSubmitError('Please agree to the privacy notice to continue.');
      return;
    }
    setSubmitError(null);
    setSaving(true);

    const scores = scoreBigFive(likertAnswers);
    const communityRole = mapCommunityRole(scores);

    const answers = {
      name: name.trim(),
      role: role || 'Member',
      bigFiveAnswers: likertAnswers,
      interests,
      preferredFormat: preferredFormat ?? 'Workshop',
      preferredTime,
    };

    await updateProfileFullName(user.id, answers.name);

    const { error } = await saveQuizSubmission(user.id, answers, communityRole, scores, communityRole);
    setSaving(false);

    if (error) {
      setSubmitError(error.message || 'Failed to save. Please try again.');
      return;
    }

    setResultRole(communityRole);
    setResultScores(scores);

    addNotification({
      type: 'quiz',
      title: 'Big Five Quiz Completed!',
      message: `Your community role: ${communityRole}. Check out your personalized recommendations!`,
      icon: '🧠',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    });
    setSubmitted(true);
  };

  if (checkingExisting) {
    return (
      <div className="flex-1 flex flex-col min-h-screen bg-gray-50/50">
        <Header title="Big Five Personality Quiz" />
        <main className="p-8 flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            <p className="text-sm text-gray-500">Loading your profile…</p>
          </div>
        </main>
      </div>
    );
  }

  if (alreadyCompleted && !submitted) {
    return (
      <div className="flex-1 flex flex-col min-h-screen bg-gray-50/50">
        <Header title="Big Five Personality Quiz" />
        <main className="p-8 flex-1 flex items-center justify-center">
          <Card className="text-center p-12 bg-white max-w-lg w-full">
            <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">You've already completed the quiz</h2>
            <p className="text-gray-600 mb-6">
              Your community role: <span className="font-semibold text-indigo-700">{alreadyCompleted.archetype}</span>
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-xl transition-colors shadow-sm"
            >
              Go to Dashboard
            </button>
            <button
              type="button"
              onClick={() => setAlreadyCompleted(null)}
              className="mt-4 block mx-auto text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              Retake quiz (new response)
            </button>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50/50">
      <Header title="Big Five Personality Quiz" />

      <main className="p-8 flex-1 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          {submitted && resultRole && resultScores ? (
            <Card className="text-center p-12 bg-white">
              <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                {ROLE_DESCRIPTIONS[resultRole].emoji}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                You're a {resultRole}!
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {ROLE_DESCRIPTIONS[resultRole].description}
              </p>

              {/* Big Five Radar */}
              <div className="mb-8 max-w-sm mx-auto h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    data={[
                      { trait: 'Extraversion', value: resultScores.extraversion },
                      { trait: 'Agreeableness', value: resultScores.agreeableness },
                      { trait: 'Conscientious.', value: resultScores.conscientiousness },
                      { trait: 'Openness', value: resultScores.openness },
                      { trait: 'Stability', value: resultScores.emotionalStability },
                    ]}
                  >
                    <PolarGrid stroke="#e0e7ff" />
                    <PolarAngleAxis dataKey="trait" tick={{ fill: '#6366f1', fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 1]} tick={false} axisLine={false} />
                    <Radar name="You" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="mb-8 text-left max-w-lg mx-auto rounded-2xl border border-indigo-100 bg-indigo-50/60 px-6 py-5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                    Recommended events
                  </span>
                </div>
                <p className="text-sm text-gray-700">
                  {ROLE_DESCRIPTIONS[resultRole].events}
                </p>
              </div>

              <button
                onClick={() => navigate('/')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-xl transition-colors shadow-sm"
              >
                Go to Dashboard
              </button>
            </Card>
          ) : (
            <Card className="bg-white shadow-sm border border-gray-100">
              <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-6 px-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-indigo-600 uppercase tracking-wider">
                    Step {step} of {TOTAL_STEPS}
                  </span>
                  <div className="flex gap-1">
                    {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 w-6 rounded-full transition-colors ${i < step ? 'bg-indigo-500' : 'bg-gray-200'}`}
                      />
                    ))}
                  </div>
                </div>
                <CardTitle className="text-2xl">
                  {step === 1
                    ? 'About You'
                    : isQuizStep
                      ? `Personality Questions (${quizPageIndex + 1}/${TOTAL_QUIZ_PAGES})`
                      : 'Your Interests & Preferences'}
                </CardTitle>
                <p className="text-gray-500 mt-1">
                  {step === 1
                    ? 'Tell us your name and role in the community.'
                    : isQuizStep
                      ? 'Rate how much you agree with each statement.'
                      : 'Select your interests and preferred event format.'}
                </p>
              </CardHeader>

              <CardContent className="p-8">
                <form
                  onSubmit={
                    step === TOTAL_STEPS
                      ? handleSubmit
                      : (e) => {
                        e.preventDefault();
                        setStep((s) => s + 1);
                      }
                  }
                  className="space-y-6"
                >
                  {submitError && (
                    <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                      {submitError}
                    </div>
                  )}

                  {/* Step 1: Name & Role */}
                  {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">What's your name?</label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                          placeholder="Jane Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">What's your primary role?</label>
                        <select
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none bg-white"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                        >
                          <option value="">Select a role...</option>
                          <option value="Designer">Designer</option>
                          <option value="Developer">Developer</option>
                          <option value="Product Manager">Product Manager</option>
                          <option value="Data Scientist">Data Scientist</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Student">Student</option>
                          <option value="Founder">Founder</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Steps 2-5: Likert Questions */}
                  {isQuizStep && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {currentQuestions.map((q) => (
                        <div key={q.id} className="space-y-3">
                          <p className="text-sm font-medium text-gray-900 leading-relaxed">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mr-2">
                              {q.id}
                            </span>
                            {q.text}
                          </p>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((value) => (
                              <button
                                key={value}
                                type="button"
                                onClick={() => setLikertAnswer(q.id, value)}
                                className={`flex-1 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                                  likertAnswers[q.id] === value
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                                }`}
                              >
                                {LIKERT_LABELS[value - 1]}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Final Step: Interests & Format */}
                  {step === TOTAL_STEPS && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-3">Select your top interests (up to 5)</label>
                        <div className="flex flex-wrap gap-2">
                          {interestOptions.map((tag) => (
                            <label key={tag} className="cursor-pointer">
                              <input
                                type="checkbox"
                                className="peer sr-only"
                                checked={interests.includes(tag)}
                                onChange={() => toggleInterest(tag)}
                              />
                              <div className="px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-600 peer-checked:bg-indigo-50 peer-checked:text-indigo-700 peer-checked:border-indigo-200 transition-colors">
                                {tag}
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-3">Preferred event format</label>
                        <div className="grid grid-cols-3 gap-3">
                          {formatOptions.map((format) => (
                            <label key={format} className="cursor-pointer">
                              <input
                                type="radio"
                                name="format"
                                className="peer sr-only"
                                checked={preferredFormat === format}
                                onChange={() => setPreferredFormat(format)}
                              />
                              <div className="px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 text-center peer-checked:bg-indigo-50 peer-checked:text-indigo-700 peer-checked:border-indigo-500 peer-checked:ring-1 peer-checked:ring-indigo-500 transition-all">
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
                              <div className="px-3 py-3 rounded-xl border border-gray-200 text-xs sm:text-sm font-medium text-gray-700 text-center peer-checked:bg-indigo-50 peer-checked:text-indigo-700 peer-checked:border-indigo-500 peer-checked:ring-1 peer-checked:ring-indigo-500 transition-all">
                                {option}
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Consent Notice */}
                      <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={consentChecked}
                            onChange={(e) => setConsentChecked(e.target.checked)}
                            className="mt-1 accent-indigo-600"
                          />
                          <span className="text-xs text-gray-600 leading-relaxed">
                            I agree that CommunityIQ may use my personality quiz answers and interest tags to personalize
                            event recommendations. My data will not be shared with third parties. I can withdraw consent
                            and delete my data anytime in profile settings.
                          </span>
                        </label>
                      </div>
                    </div>
                  )}

                  <div className="mt-10 flex items-center justify-between pt-6 border-t border-gray-100">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={() => setStep((s) => s - 1)}
                        className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                    ) : (
                      <div />
                    )}
                    <button
                      type="submit"
                      disabled={saving || (isQuizStep && !allQuestionsAnswered)}
                      className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2.5 px-8 rounded-xl transition-colors shadow-sm ml-auto flex items-center gap-2"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving…
                        </>
                      ) : step === TOTAL_STEPS ? (
                        'Submit Profile'
                      ) : (
                        <>
                          Continue <ChevronRight className="w-4 h-4" />
                        </>
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
