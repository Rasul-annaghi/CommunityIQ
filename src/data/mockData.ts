export interface Member {
  id: string;
  name: string;
  role: string;
  // Big Five scores (0.0–1.0)
  extraversion: number;
  agreeableness: number;
  conscientiousness: number;
  openness: number;
  emotionalStability: number;
  communityRole: string;
  interests: string[];
  preferred_format: string;
  preferred_time: string;
  // Legacy compat (derived from Big Five)
  intro_extro_score: number;
  creative_technical_score: number;
  collaboration_score: number;
}

export interface Cluster {
  id: string;
  name: string;
  description: string;
  size: number;
  avg_intro_extro: number;
  avg_creative_technical: number;
  avg_collaboration: number;
  // Big Five averages
  avg_extraversion: number;
  avg_agreeableness: number;
  avg_conscientiousness: number;
  avg_openness: number;
  avg_emotionalStability: number;
  dominant_interests: string[];
  recommended_event_type: string;
  recommended_time: string;
  recommended_group_size: string;
  color: string;
}

export interface EventRecommendation {
  id: string;
  cluster_id: string;
  title: string;
  format: string;
  description: string;
  ideal_size: string;
  ideal_duration: string;
  why_this_fits: string;
  energy_level: string;
  venue_type_needed: string;
  image: string;
  date: string;
  price: number;
  address: string;
  host: string;
  details: string[];
  personality_profile: number[]; // [E,A,C,O,S]
  tags: string[];
}

export interface Venue {
  id: string;
  name: string;
  type: string;
  capacity: number;
  location: string;
  indoor_outdoor: string;
  suitability_tags: string[];
  image: string;
  suitability_score: number;
}

// Helper: create a Member from Big Five scores
function makeMember(
  id: string, name: string, role: string,
  E: number, A: number, C: number, O: number, S: number,
  communityRole: string, interests: string[],
  preferred_format: string, preferred_time: string
): Member {
  return {
    id, name, role,
    extraversion: E, agreeableness: A, conscientiousness: C, openness: O, emotionalStability: S,
    communityRole, interests, preferred_format, preferred_time,
    // Legacy compat: map Big Five → old 1-5 scores
    intro_extro_score: Math.round(E * 4 + 1),
    creative_technical_score: Math.round(O * 4 + 1),
    collaboration_score: Math.round(A * 4 + 1),
  };
}

export const mockMembers: Member[] = [
  makeMember('1', 'Alice', 'Designer', 0.3, 0.7, 0.5, 0.9, 0.6, 'Innovator', ['Design', 'UX Research', 'Art'], 'Workshop', 'Weekend'),
  makeMember('2', 'Bob', 'Developer', 0.8, 0.5, 0.7, 0.8, 0.5, 'Community Builder', ['AI', 'Startups', 'Coding'], 'Hackathon', 'Evening'),
  makeMember('3', 'Charlie', 'Data Scientist', 0.2, 0.6, 0.9, 0.7, 0.7, 'Specialist', ['Data Science', 'AI', 'Cloud/DevOps'], 'Study Group', 'Weekend'),
  makeMember('4', 'Diana', 'Product Manager', 0.9, 0.8, 0.6, 0.5, 0.4, 'Community Builder', ['Leadership', 'Startups', 'Marketing'], 'Mixer', 'Evening'),
  makeMember('5', 'Eve', 'Illustrator', 0.2, 0.8, 0.4, 0.8, 0.7, 'Supporter', ['Design', 'Community', 'Open Source'], 'Workshop', 'Weekend'),
  makeMember('6', 'Frank', 'DevOps', 0.3, 0.5, 0.8, 0.4, 0.7, 'Specialist', ['Cloud/DevOps', 'Coding', 'Open Source'], 'Seminar', 'Evening'),
  makeMember('7', 'Grace', 'Marketing', 0.9, 0.9, 0.3, 0.5, 0.4, 'Community Builder', ['Marketing', 'Community', 'Startups'], 'Mixer', 'Evening'),
  makeMember('8', 'Hank', 'Backend Dev', 0.2, 0.4, 0.9, 0.5, 0.7, 'Specialist', ['Coding', 'Cloud/DevOps', 'Data Science'], 'Study Group', 'Weekend'),
  makeMember('9', 'Ivy', 'UX Researcher', 0.5, 0.8, 0.6, 0.6, 0.8, 'Supporter', ['UX Research', 'Design', 'Data Science'], 'Workshop', 'Evening'),
  makeMember('10', 'Jack', 'Founder', 0.9, 0.6, 0.5, 0.8, 0.3, 'Innovator', ['Startups', 'AI', 'Leadership'], 'Pitch Night', 'Evening'),
  // 20 more seed users with varied Big Five profiles
  makeMember('11', 'Leyla', 'Developer', 0.8, 0.7, 0.4, 0.9, 0.5, 'Community Builder', ['AI', 'Startups', 'Hackathons'], 'Hackathon', 'Evening'),
  makeMember('12', 'Murad', 'Developer', 0.3, 0.6, 0.9, 0.4, 0.7, 'Organizer', ['Coding', 'Open Source'], 'Study Group', 'Weekend'),
  makeMember('13', 'Nigar', 'Designer', 0.6, 0.5, 0.7, 0.8, 0.6, 'Innovator', ['UX Research', 'Design', 'Mobile Dev'], 'Workshop', 'Evening'),
  makeMember('14', 'Samir', 'Founder', 0.9, 0.8, 0.3, 0.6, 0.4, 'Community Builder', ['Startups', 'Leadership', 'Marketing'], 'Mixer', 'Evening'),
  makeMember('15', 'Kamala', 'Student', 0.2, 0.9, 0.5, 0.3, 0.8, 'Supporter', ['Community', 'Open Source'], 'Workshop', 'Weekend'),
  makeMember('16', 'Elvin', 'Data Scientist', 0.4, 0.5, 0.8, 0.5, 0.6, 'Organizer', ['Data Science', 'AI', 'Cloud/DevOps'], 'Seminar', 'Evening'),
  makeMember('17', 'Aytaj', 'Marketing', 0.5, 0.6, 0.6, 0.7, 0.5, 'Innovator', ['AI', 'Startups', 'Blockchain'], 'Hackathon', 'Evening'),
  makeMember('18', 'Rasul', 'Developer', 0.4, 0.7, 0.9, 0.4, 0.8, 'Organizer', ['Coding', 'Open Source', 'Cloud/DevOps'], 'Study Group', 'Weekend'),
  makeMember('19', 'Gunel', 'Product Manager', 0.8, 0.4, 0.6, 0.5, 0.5, 'Participant', ['Startups', 'Leadership'], 'Pitch Night', 'Evening'),
  makeMember('20', 'Farid', 'Student', 0.5, 0.9, 0.5, 0.3, 0.9, 'Supporter', ['Community', 'Open Source'], 'Workshop', 'Weekend'),
  makeMember('21', 'Nargiz', 'Designer', 0.3, 0.8, 0.7, 0.6, 0.7, 'Supporter', ['Design', 'UX Research'], 'Workshop', 'Weekend'),
  makeMember('22', 'Tural', 'Developer', 0.7, 0.5, 0.8, 0.9, 0.4, 'Innovator', ['AI', 'Mobile Dev', 'Blockchain'], 'Hackathon', 'Evening'),
  makeMember('23', 'Sevinj', 'Marketing', 0.8, 0.8, 0.4, 0.4, 0.6, 'Community Builder', ['Marketing', 'Community', 'Leadership'], 'Mixer', 'Evening'),
  makeMember('24', 'Orkhan', 'Developer', 0.2, 0.3, 0.9, 0.6, 0.8, 'Specialist', ['Coding', 'Data Science', 'AI'], 'Study Group', 'Weekday Morning'),
  makeMember('25', 'Aysel', 'Student', 0.6, 0.7, 0.5, 0.8, 0.5, 'Innovator', ['AI', 'Design', 'Startups'], 'Workshop', 'Weekend'),
  makeMember('26', 'Rufat', 'DevOps', 0.4, 0.6, 0.8, 0.3, 0.7, 'Organizer', ['Cloud/DevOps', 'Coding'], 'Seminar', 'Evening'),
  makeMember('27', 'Lamiya', 'Data Scientist', 0.5, 0.5, 0.7, 0.9, 0.6, 'Innovator', ['Data Science', 'AI', 'Blockchain'], 'Hackathon', 'Weekend'),
  makeMember('28', 'Emil', 'Founder', 0.9, 0.6, 0.5, 0.7, 0.3, 'Community Builder', ['Startups', 'AI', 'Leadership'], 'Pitch Night', 'Evening'),
  makeMember('29', 'Ulviyya', 'Designer', 0.3, 0.9, 0.6, 0.5, 0.9, 'Supporter', ['Design', 'Community', 'UX Research'], 'Workshop', 'Weekend'),
  makeMember('30', 'Javid', 'Developer', 0.6, 0.5, 0.6, 0.8, 0.5, 'Participant', ['Coding', 'AI', 'Mobile Dev'], 'Hackathon', 'Evening'),
];

export const mockClusters: Cluster[] = [
  {
    id: 'community-builder',
    name: 'Community Builders',
    description: 'Natural connectors with high extraversion and agreeableness – they bring people together.',
    size: 7, avg_intro_extro: 4.5, avg_creative_technical: 3.0, avg_collaboration: 4.5,
    avg_extraversion: 0.87, avg_agreeableness: 0.73, avg_conscientiousness: 0.45, avg_openness: 0.6, avg_emotionalStability: 0.44,
    dominant_interests: ['Startups', 'Leadership', 'Networking'],
    recommended_event_type: 'Networking Mixer', recommended_time: 'Weekday Evening', recommended_group_size: 'Large (30+)',
    color: '#f59e0b',
  },
  {
    id: 'organizer',
    name: 'Organizers',
    description: 'Reliable planners with high conscientiousness who keep events structured and on track.',
    size: 5, avg_intro_extro: 2.5, avg_creative_technical: 4.0, avg_collaboration: 3.5,
    avg_extraversion: 0.36, avg_agreeableness: 0.58, avg_conscientiousness: 0.86, avg_openness: 0.42, avg_emotionalStability: 0.7,
    dominant_interests: ['Coding', 'Open Source', 'Cloud/DevOps'],
    recommended_event_type: 'Structured Workshop', recommended_time: 'Weekend Morning', recommended_group_size: 'Medium (15-30)',
    color: '#3b82f6',
  },
  {
    id: 'innovator',
    name: 'Innovators',
    description: 'Idea generators and experimental thinkers with high openness who push boundaries.',
    size: 7, avg_intro_extro: 3.5, avg_creative_technical: 4.5, avg_collaboration: 3.0,
    avg_extraversion: 0.54, avg_agreeableness: 0.57, avg_conscientiousness: 0.57, avg_openness: 0.83, avg_emotionalStability: 0.51,
    dominant_interests: ['AI', 'Hackathons', 'Blockchain'],
    recommended_event_type: 'AI Hackathon', recommended_time: 'Weekend', recommended_group_size: 'Medium (15-30)',
    color: '#8b5cf6',
  },
  {
    id: 'supporter',
    name: 'Supporters',
    description: 'Great mentors and helpers with high agreeableness and emotional stability.',
    size: 6, avg_intro_extro: 2.0, avg_creative_technical: 3.0, avg_collaboration: 4.5,
    avg_extraversion: 0.33, avg_agreeableness: 0.83, avg_conscientiousness: 0.55, avg_openness: 0.52, avg_emotionalStability: 0.8,
    dominant_interests: ['Community', 'Design', 'Open Source'],
    recommended_event_type: 'Mentoring Workshop', recommended_time: 'Weekend Afternoon', recommended_group_size: 'Small (5-15)',
    color: '#10b981',
  },
  {
    id: 'specialist',
    name: 'Specialists',
    description: 'Focused contributors who prefer deep work and structured, goal-oriented sessions.',
    size: 4, avg_intro_extro: 1.5, avg_creative_technical: 4.5, avg_collaboration: 2.0,
    avg_extraversion: 0.22, avg_agreeableness: 0.45, avg_conscientiousness: 0.88, avg_openness: 0.5, avg_emotionalStability: 0.72,
    dominant_interests: ['Coding', 'Data Science', 'Cloud/DevOps'],
    recommended_event_type: 'Focused Build Sprint', recommended_time: 'Weekend Morning', recommended_group_size: 'Small (5-15)',
    color: '#ef4444',
  },
];

export const mockRecommendations: EventRecommendation[] = [
  {
    id: 'r1', cluster_id: 'innovator',
    title: 'AI Ideation Hackathon',
    format: 'Hackathon', description: 'A 6-hour hackathon where small teams prototype AI ideas. Demo and pitch at the end.',
    ideal_size: '30-50', ideal_duration: '6 hours',
    why_this_fits: 'Perfect for Innovators who crave experimentation and building new things with AI.',
    energy_level: 'High/Dynamic', venue_type_needed: 'Innovation Hub',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800',
    date: 'April 20, 2026', price: 15, address: 'Innovation Hub, Baku', host: 'CommunityIQ',
    details: ['Rapid team formation', 'Focused build session (4 hours)', 'Live pitch presentations', 'Networking with mentors', 'Prizes for top ideas'],
    personality_profile: [0.4, 0.5, 0.7, 0.9, 0.4], tags: ['hackathon', 'AI', 'prototyping'],
  },
  {
    id: 'r2', cluster_id: 'community-builder',
    title: 'Startup Demo Night',
    format: 'Pitch Night', description: 'Members present startup ideas in 3-minute pitches and get live feedback from investors.',
    ideal_size: '40-80', ideal_duration: '3 hours',
    why_this_fits: 'Community Builders thrive in high-energy social events where they connect people.',
    energy_level: 'High/Social', venue_type_needed: 'Event Hall',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800',
    date: 'April 28, 2026', price: 20, address: 'Startup Hub, Baku', host: 'TechStart Baku',
    details: ['3-minute pitches', 'Live investor feedback', 'Networking cocktails', 'Startup showcase', 'Best Pitch Award'],
    personality_profile: [0.9, 0.8, 0.4, 0.7, 0.6], tags: ['startups', 'pitching', 'networking'],
  },
  {
    id: 'r3', cluster_id: 'specialist',
    title: 'Focused Build Sprint',
    format: 'Co-working', description: 'A dedicated block of time for members to bring their own projects and work alongside others, followed by a show-and-tell.',
    ideal_size: '10-20', ideal_duration: '3 hours',
    why_this_fits: 'Specialists need structured, quiet environments where they can focus on deep technical work.',
    energy_level: 'Low/Intense', venue_type_needed: 'Library or Quiet Lab',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    date: 'May 12, 2026', price: 10, address: 'Co-working Space, Baku', host: 'Dev Community',
    details: ['Quiet work environment', 'Dedicated project time', 'Optional pair programming', 'Show-and-tell session', 'Coffee & snacks'],
    personality_profile: [0.3, 0.7, 0.9, 0.3, 0.7], tags: ['coding', 'workshop', 'OSS'],
  },
  {
    id: 'r4', cluster_id: 'supporter',
    title: 'Mentoring Workshop & Design Jam',
    format: 'Workshop', description: 'A quiet, collaborative session where experienced members mentor newcomers through a design challenge.',
    ideal_size: '10-15', ideal_duration: '2 hours',
    why_this_fits: 'Supporters excel as mentors in small-group, collaborative settings with clear goals.',
    energy_level: 'Low/Focused', venue_type_needed: 'Studio or Classroom',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800',
    date: 'May 2, 2026', price: 0, address: 'Design Lab, Baku', host: 'Creative Collective',
    details: ['Mentor-mentee pairing', 'Design challenge', 'Personal feedback', 'Portfolio review', 'Certificate of completion'],
    personality_profile: [0.3, 0.8, 0.6, 0.5, 0.7], tags: ['workshop', 'design', 'mentoring'],
  },
  {
    id: 'r5', cluster_id: 'organizer',
    title: 'Open Source Sprint',
    format: 'Sprint', description: 'Bring your own OSS project and code alongside mentors. Pair programming welcome.',
    ideal_size: '15-25', ideal_duration: '5 hours',
    why_this_fits: 'Organizers love structured sessions with clear deliverables. An OSS sprint lets them lead sub-teams.',
    energy_level: 'Medium/Structured', venue_type_needed: 'Co-working Space',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
    date: 'May 12, 2026', price: 5, address: 'Tech Hub, Baku', host: 'Open Source Azerbaijan',
    details: ['Project onboarding', 'Pair programming sessions', 'Code review workshops', 'PR celebration', 'Pizza & drinks'],
    personality_profile: [0.3, 0.7, 0.9, 0.5, 0.7], tags: ['coding', 'OSS', 'mentorship'],
  },
  {
    id: 'r6', cluster_id: 'community-builder',
    title: 'Community Mixer & Brainstorm',
    format: 'Mixer', description: 'An open, unstructured event with facilitated icebreakers and group brainstorming for community initiatives.',
    ideal_size: '40+', ideal_duration: '2 hours',
    why_this_fits: 'Leverages their high social energy and desire to connect and collaborate on big ideas.',
    energy_level: 'High/Social', venue_type_needed: 'Event Hall or Café Lounge',
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=800',
    date: 'May 28, 2026', price: 15, address: 'Event Hall, Baku', host: 'CommunityIQ',
    details: ['Facilitated icebreakers', 'Group brainstorming', 'Open discussions', 'Networking', 'Appetizers & drinks'],
    personality_profile: [0.8, 0.9, 0.3, 0.5, 0.5], tags: ['networking', 'brainstorm', 'community'],
  },
];

export const mockVenues: Venue[] = [
  {
    id: 'v1', name: 'The Greenhouse Co-working', type: 'Co-working Space', capacity: 60,
    location: 'Downtown Baku', indoor_outdoor: 'Indoor',
    suitability_tags: ['Hackathon', 'Sprint', 'Tech'],
    image: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&q=80&w=800',
    suitability_score: 95,
  },
  {
    id: 'v2', name: 'Central Library Annex', type: 'Library Room', capacity: 20,
    location: 'Midtown Baku', indoor_outdoor: 'Indoor',
    suitability_tags: ['Workshop', 'Study Group', 'Quiet'],
    image: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=800',
    suitability_score: 88,
  },
  {
    id: 'v3', name: 'Artisan Studio Loft', type: 'Studio', capacity: 15,
    location: 'Arts District, Baku', indoor_outdoor: 'Indoor',
    suitability_tags: ['Design', 'Creative', 'Workshop'],
    image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800',
    suitability_score: 92,
  },
  {
    id: 'v4', name: 'Caspian Event Hall', type: 'Event Hall', capacity: 150,
    location: 'Caspian Plaza, Baku', indoor_outdoor: 'Indoor',
    suitability_tags: ['Mixer', 'Pitch Night', 'Large Group'],
    image: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&q=80&w=800',
    suitability_score: 90,
  },
];
