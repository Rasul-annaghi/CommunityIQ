import { supabase } from './supabase';
import type { QuizSubmissionInsert } from '../types/database';
import type { BigFiveScores, CommunityRole } from '../data/bigFiveQuiz';

export type QuizAnswers = {
  name: string;
  role: string;
  bigFiveAnswers: Record<number, number>;
  interests: string[];
  preferredFormat: string;
  preferredTime: string;
};

export async function saveQuizSubmission(
  userId: string,
  answers: QuizAnswers,
  archetype: string,
  scores: BigFiveScores,
  communityRole: CommunityRole
): Promise<{ error: Error | null }> {
  const row: QuizSubmissionInsert = {
    user_id: userId,
    answers: answers as unknown as QuizSubmissionInsert['answers'],
    archetype,
  };

  const { error: quizError } = await supabase.from('quiz_submissions').insert(row);
  if (quizError) return { error: quizError };

  // Also update the profile with Big Five scores and role
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      extraversion: scores.extraversion,
      agreeableness: scores.agreeableness,
      conscientiousness: scores.conscientiousness,
      openness: scores.openness,
      emotional_stability: scores.emotionalStability,
      community_role: communityRole,
      interests: answers.interests,
      consent_profile: true,
      consent_date: new Date().toISOString(),
    })
    .eq('id', userId);

  if (profileError) {
    console.warn('Failed to update profile with Big Five scores:', profileError.message);
  }

  return { error: null };
}

export async function getLatestQuizSubmission(userId: string) {
  const { data, error } = await supabase
    .from('quiz_submissions')
    .select('id, answers, archetype, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) return { data: null, error };
  return { data, error: null };
}

export async function updateProfileFullName(userId: string, fullName: string) {
  const { error } = await supabase
    .from('profiles')
    .update({ full_name: fullName })
    .eq('id', userId);
  return { error: error ?? null };
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  return { data, error };
}
