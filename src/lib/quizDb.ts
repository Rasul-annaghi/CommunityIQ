import { supabase } from './supabase';
import type { QuizSubmissionInsert } from '../types/database';

export type QuizAnswers = {
  name: string;
  role: string;
  introExtroScore: number;
  creativeTechnicalScore: number;
  collaborationScore: number;
  interests: string[];
  preferredFormat: string;
  preferredTime: string;
};

export async function saveQuizSubmission(
  userId: string,
  answers: QuizAnswers,
  archetype: string
): Promise<{ error: Error | null }> {
  const row: QuizSubmissionInsert = {
    user_id: userId,
    answers: answers as unknown as QuizSubmissionInsert['answers'],
    archetype,
  };
  const { error } = await supabase.from('quiz_submissions').insert(row);
  return { error: error ?? null };
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
