// Big Five personality quiz: 12 Likert-scale questions + scoring + role mapping

export interface QuizQuestion {
  id: number;
  text: string;
  trait: 'E' | 'A' | 'C' | 'O' | 'S';
}

export interface BigFiveScores {
  extraversion: number;
  agreeableness: number;
  conscientiousness: number;
  openness: number;
  emotionalStability: number;
}

export type CommunityRole =
  | 'Community Builder'
  | 'Organizer'
  | 'Innovator'
  | 'Supporter'
  | 'Specialist'
  | 'Participant';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Extraversion (3 questions)
  { id: 1, text: 'I enjoy being the center of attention in group activities.', trait: 'E' },
  { id: 2, text: 'I usually start conversations in new groups.', trait: 'E' },
  { id: 3, text: 'I feel energized after attending events or meetups.', trait: 'E' },
  // Agreeableness (2 questions)
  { id: 4, text: 'I enjoy helping other people solve their problems.', trait: 'A' },
  { id: 5, text: 'I prefer collaboration rather than competition.', trait: 'A' },
  // Conscientiousness (2 questions)
  { id: 6, text: 'I like organizing projects, events, or team activities.', trait: 'C' },
  { id: 7, text: 'I plan things ahead instead of acting spontaneously.', trait: 'C' },
  // Openness (2 questions)
  { id: 8, text: 'I enjoy exploring new ideas, technologies, or cultures.', trait: 'O' },
  { id: 9, text: 'I enjoy learning skills outside my main field.', trait: 'O' },
  // Emotional Stability (2 questions)
  { id: 10, text: 'I handle criticism or feedback well.', trait: 'S' },
  { id: 11, text: 'I rarely feel overwhelmed during busy schedules.', trait: 'S' },
  // Community Motivation (1 question)
  { id: 12, text: 'I join communities mainly to learn and meet new people.', trait: 'E' },
];

export const LIKERT_LABELS = [
  'Strongly Disagree',
  'Disagree',
  'Neutral',
  'Agree',
  'Strongly Agree',
];

/**
 * Given raw answers {questionId: 1-5}, compute Big Five scores normalized to 0...1.
 */
export function scoreBigFive(answers: Record<number, number>): BigFiveScores {
  const traitQuestions: Record<string, number[]> = {
    E: [1, 2, 3],
    A: [4, 5],
    C: [6, 7],
    O: [8, 9],
    S: [10, 11],
  };

  const compute = (ids: number[]): number => {
    const sum = ids.reduce((acc, id) => acc + (answers[id] ?? 3), 0);
    return sum / (5 * ids.length); // normalize to 0..1
  };

  return {
    extraversion: compute(traitQuestions.E),
    agreeableness: compute(traitQuestions.A),
    conscientiousness: compute(traitQuestions.C),
    openness: compute(traitQuestions.O),
    emotionalStability: compute(traitQuestions.S),
  };
}

/**
 * Map Big Five scores to one of five community roles.
 */
export function mapCommunityRole(scores: BigFiveScores): CommunityRole {
  const { extraversion: E, agreeableness: A, conscientiousness: C, openness: O, emotionalStability: S } = scores;

  if (E > 0.7 && A > 0.7) return 'Community Builder';
  if (C > 0.7) return 'Organizer';
  if (O > 0.7) return 'Innovator';
  if (A > 0.7 && S > 0.7) return 'Supporter';
  if (E < 0.4 && C > 0.6) return 'Specialist';
  return 'Participant';
}

export const ROLE_DESCRIPTIONS: Record<CommunityRole, { emoji: string; description: string; events: string }> = {
  'Community Builder': {
    emoji: '🤝',
    description: 'You thrive in social environments and enjoy bringing people together. You are likely a connector, organizer, or ambassador in communities.',
    events: 'Networking nights, community socials, demo days',
  },
  Organizer: {
    emoji: '📋',
    description: 'You are a reliable planner who keeps events structured and on track. Your attention to detail makes you the backbone of any community initiative.',
    events: 'Project sprints, structured workshops, planning sessions',
  },
  Innovator: {
    emoji: '💡',
    description: 'You are an idea generator and experimental thinker. You love exploring new technologies and pushing boundaries with creative solutions.',
    events: 'Hackathons, brainstorming sessions, AI workshops',
  },
  Supporter: {
    emoji: '🫶',
    description: 'You are a great mentor and helper. Your empathy and stability make you someone others trust and turn to for guidance.',
    events: 'Mentoring circles, support groups, teaching sessions',
  },
  Specialist: {
    emoji: '🔬',
    description: 'You are a focused contributor who prefers deep work and mastering your craft. You thrive in structured, goal-oriented environments.',
    events: 'Focused build sprints, study groups, technical deep-dives',
  },
  Participant: {
    emoji: '🌟',
    description: 'You have a balanced personality profile that fits well in many community settings. You bring versatility and adaptability to any group.',
    events: 'Mix of social events, workshops, and collaborative sessions',
  },
};
