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

type QuizMemberInput = {
  name: string;
  role: string;
  introExtroScore: number;
  creativeTechnicalScore: number;
  collaborationScore: number;
  interests: string[];
  preferredFormat: string;
  preferredTime: string;
};

type ClusterId = Cluster['id'];

const dynamicMembers: Member[] = [];

export function addMemberFromQuiz(input: QuizMemberInput): { member: Member; clusterId: ClusterId } {
  const member: Member = {
    id: `q_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: input.name.trim(),
    role: input.role || 'Member',
    intro_extro_score: clampScore(input.introExtroScore),
    creative_technical_score: clampScore(input.creativeTechnicalScore),
    collaboration_score: clampScore(input.collaborationScore),
    interests: input.interests,
    preferred_format: input.preferredFormat,
    preferred_time: input.preferredTime,
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

  const buckets: Record<ClusterId, Member[]> = Object.fromEntries(
    mockClusters.map((c) => [c.id, [] as Member[]]),
  ) as Record<ClusterId, Member[]>;

  for (const member of allMembers) {
    const id = inferClusterId(member);
    if (!buckets[id]) {
      buckets[id] = [];
    }
    buckets[id].push(member);
  }

  return mockClusters.map((template) => {
    const members = buckets[template.id] ?? [];
    const count = members.length;

    if (!count) {
      return template;
    }

    const totals = members.reduce(
      (acc, m) => {
        acc.intro += m.intro_extro_score;
        acc.creativeTech += m.creative_technical_score;
        acc.collab += m.collaboration_score;
        return acc;
      },
      { intro: 0, creativeTech: 0, collab: 0 },
    );

    const avg_intro_extro = round1(totals.intro / count);
    const avg_creative_technical = round1(totals.creativeTech / count);
    const avg_collaboration = round1(totals.collab / count);

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
      avg_intro_extro,
      avg_creative_technical,
      avg_collaboration,
      dominant_interests,
    };
  });
}

export function getClusterById(id: ClusterId): Cluster | undefined {
  return getClusterSummaries().find((c) => c.id === id);
}

export function getRecommendations(): EventRecommendation[] {
  const clusters = getClusterSummaries();
  const clusterById = new Map<ClusterId, Cluster>();
  for (const c of clusters) {
    clusterById.set(c.id, c);
  }

  return [...mockRecommendations].sort((a, b) => {
    const aSize = clusterById.get(a.cluster_id)?.size ?? 0;
    const bSize = clusterById.get(b.cluster_id)?.size ?? 0;
    return bSize - aSize;
  });
}

export function getRecommendationForCluster(clusterId: ClusterId): EventRecommendation | undefined {
  return mockRecommendations.find((rec) => rec.cluster_id === clusterId);
}

export function getTopVenues(): Venue[] {
  return mockVenues;
}

export function inferClusterId(member: Member): ClusterId {
  const intro = clampScore(member.intro_extro_score);
  const creativeTech = clampScore(member.creative_technical_score);
  const collab = clampScore(member.collaboration_score);

  if (intro <= 2 && creativeTech <= 3 && collab <= 3) {
    return 'c1';
  }

  if (intro >= 4 && creativeTech >= 4 && collab >= 3) {
    return 'c2';
  }

  if (intro <= 3 && creativeTech >= 4 && collab <= 3) {
    return 'c3';
  }

  if (intro >= 4 && collab >= 4) {
    return 'c4';
  }

  const archetypeCenters: Record<ClusterId, [number, number, number]> = {
    c1: [1.5, 2, 2],
    c2: [4.5, 4.5, 4],
    c3: [2, 4.5, 2],
    c4: [4.5, 2.5, 4.5],
  };

  let bestId: ClusterId = 'c1';
  let bestDistance = Number.POSITIVE_INFINITY;

  (Object.keys(archetypeCenters) as ClusterId[]).forEach((id) => {
    const [i, ct, co] = archetypeCenters[id];
    const d =
      (intro - i) * (intro - i) +
      (creativeTech - ct) * (creativeTech - ct) +
      (collab - co) * (collab - co);
    if (d < bestDistance) {
      bestDistance = d;
      bestId = id;
    }
  });

  return bestId;
}

function clampScore(value: number): number {
  if (Number.isNaN(value)) return 3;
  return Math.min(5, Math.max(1, Math.round(value)));
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

