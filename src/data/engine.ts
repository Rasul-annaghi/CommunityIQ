import {
  type Member,
  type Cluster,
  type EventRecommendation,
  type Venue,
  mockMembers,
  mockClusters,
  mockRecommendations,
  mockVenues,
} from './mockData';

const dynamicMembers: Member[] = [];

export function addMemberFromQuiz(input: {
  name: string;
  role: string;
  extraversion: number;
  agreeableness: number;
  conscientiousness: number;
  openness: number;
  emotionalStability: number;
  communityRole: string;
  interests: string[];
  preferredFormat: string;
  preferredTime: string;
}): { member: Member; clusterId: string } {
  const member: Member = {
    id: `q_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: input.name.trim(),
    role: input.role || 'Member',
    extraversion: input.extraversion,
    agreeableness: input.agreeableness,
    conscientiousness: input.conscientiousness,
    openness: input.openness,
    emotionalStability: input.emotionalStability,
    communityRole: input.communityRole,
    interests: input.interests,
    preferred_format: input.preferredFormat,
    preferred_time: input.preferredTime,
    intro_extro_score: Math.round(input.extraversion * 4 + 1),
    creative_technical_score: Math.round(input.openness * 4 + 1),
    collaboration_score: Math.round(input.agreeableness * 4 + 1),
  };

  dynamicMembers.push(member);
  const clusterId = inferClusterId(member);
  return { member, clusterId };
}

export function getAllMembers(): Member[] {
  return [...mockMembers, ...dynamicMembers];
}

export function getClusterSummaries(): Cluster[] {
  const allMembers = getAllMembers();
  const clusterIds = mockClusters.map((c) => c.id);

  const buckets: Record<string, Member[]> = Object.fromEntries(
    clusterIds.map((id) => [id, [] as Member[]]),
  );

  for (const member of allMembers) {
    const id = inferClusterId(member);
    if (!buckets[id]) buckets[id] = [];
    buckets[id].push(member);
  }

  return mockClusters.map((template) => {
    const members = buckets[template.id] ?? [];
    const count = members.length;

    if (!count) return template;

    const avgE = avg(members.map((m) => m.extraversion));
    const avgA = avg(members.map((m) => m.agreeableness));
    const avgC = avg(members.map((m) => m.conscientiousness));
    const avgO = avg(members.map((m) => m.openness));
    const avgS = avg(members.map((m) => m.emotionalStability));

    const interestCounts = new Map<string, number>();
    for (const m of members) {
      for (const interest of m.interests) {
        interestCounts.set(interest, (interestCounts.get(interest) ?? 0) + 1);
      }
    }

    const dominant_interests =
      interestCounts.size === 0
        ? template.dominant_interests
        : Array.from(interestCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([interest]) => interest);

    return {
      ...template,
      size: count,
      avg_extraversion: round2(avgE),
      avg_agreeableness: round2(avgA),
      avg_conscientiousness: round2(avgC),
      avg_openness: round2(avgO),
      avg_emotionalStability: round2(avgS),
      avg_intro_extro: round2(avgE * 4 + 1),
      avg_creative_technical: round2(avgO * 4 + 1),
      avg_collaboration: round2(avgA * 4 + 1),
      dominant_interests,
    };
  });
}

export function getClusterById(id: string): Cluster | undefined {
  return getClusterSummaries().find((c) => c.id === id);
}

/**
 * Hybrid event scoring: α * content_score + (1-α) * personality_bonus
 */
export function hybridScore(
  userTraits: number[],
  userInterests: string[],
  eventProfile: number[],
  eventTags: string[],
  alpha = 0.6
): number {
  const content = jaccardSimilarity(userInterests, eventTags);
  const personality = dotProduct(userTraits, eventProfile) / 5;
  return alpha * content + (1 - alpha) * personality;
}

function jaccardSimilarity(a: string[], b: string[]): number {
  if (!a.length && !b.length) return 0;
  const setA = new Set(a.map((s) => s.toLowerCase()));
  const setB = new Set(b.map((s) => s.toLowerCase()));
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }
  const union = new Set([...setA, ...setB]).size;
  return union > 0 ? intersection / union : 0;
}

function dotProduct(a: number[], b: number[]): number {
  let sum = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) sum += a[i] * b[i];
  return sum;
}

export function getRecommendations(): EventRecommendation[] {
  return [...mockRecommendations];
}

export function getRecommendationsForUser(
  userTraits: number[],
  userInterests: string[]
): EventRecommendation[] {
  const scored = mockRecommendations.map((rec) => ({
    rec,
    score: hybridScore(
      userTraits,
      userInterests,
      rec.personality_profile,
      rec.tags,
    ),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.rec);
}

export function getRecommendationForCluster(clusterId: string): EventRecommendation | undefined {
  return mockRecommendations.find((rec) => rec.cluster_id === clusterId);
}

export function getTopVenues(): Venue[] {
  return mockVenues;
}

export function inferClusterId(member: Member): string {
  const { extraversion: E, agreeableness: A, conscientiousness: C, openness: O, emotionalStability: S } = member;

  if (E > 0.7 && A > 0.7) return 'community-builder';
  if (C > 0.7) return 'organizer';
  if (O > 0.7) return 'innovator';
  if (A > 0.7 && S > 0.7) return 'supporter';
  if (E < 0.4 && C > 0.6) return 'specialist';
  return 'innovator'; // default
}

/**
 * Compute community-level Big Five averages from all members.
 */
export function getCommunityAverages(): {
  extraversion: number;
  agreeableness: number;
  conscientiousness: number;
  openness: number;
  emotionalStability: number;
  topInterests: { name: string; count: number }[];
  roleDistribution: { role: string; count: number; percent: number }[];
  totalMembers: number;
} {
  const members = getAllMembers();
  const n = members.length || 1;

  const avgE = avg(members.map((m) => m.extraversion));
  const avgA = avg(members.map((m) => m.agreeableness));
  const avgC = avg(members.map((m) => m.conscientiousness));
  const avgO = avg(members.map((m) => m.openness));
  const avgS = avg(members.map((m) => m.emotionalStability));

  const interestCounts = new Map<string, number>();
  const roleCounts = new Map<string, number>();
  for (const m of members) {
    for (const i of m.interests) {
      interestCounts.set(i, (interestCounts.get(i) ?? 0) + 1);
    }
    roleCounts.set(m.communityRole, (roleCounts.get(m.communityRole) ?? 0) + 1);
  }

  const topInterests = Array.from(interestCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  const roleDistribution = Array.from(roleCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([role, count]) => ({ role, count, percent: Math.round((count / members.length) * 100) }));

  return {
    extraversion: round2(avgE),
    agreeableness: round2(avgA),
    conscientiousness: round2(avgC),
    openness: round2(avgO),
    emotionalStability: round2(avgS),
    topInterests,
    roleDistribution,
    totalMembers: members.length,
  };
}

function avg(arr: number[]): number {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
