export interface Member {
  id: string;
  name: string;
  role: string;
  intro_extro_score: number; // 1 (Intro) to 5 (Extro)
  creative_technical_score: number; // 1 (Creative) to 5 (Technical)
  collaboration_score: number; // 1 (Independent) to 5 (Collaborative)
  interests: string[];
  preferred_format: string;
  preferred_time: string;
}

export interface Cluster {
  id: string;
  name: string;
  description: string;
  size: number;
  avg_intro_extro: number;
  avg_creative_technical: number;
  avg_collaboration: number;
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

export const mockMembers: Member[] = [
  { id: '1', name: 'Alice', role: 'Designer', intro_extro_score: 2, creative_technical_score: 1, collaboration_score: 2, interests: ['UI/UX', 'Art', 'Typography'], preferred_format: 'Workshop', preferred_time: 'Weekend' },
  { id: '2', name: 'Bob', role: 'Developer', intro_extro_score: 4, creative_technical_score: 5, collaboration_score: 4, interests: ['React', 'Node.js', 'Startups'], preferred_format: 'Hackathon', preferred_time: 'Evening' },
  { id: '3', name: 'Charlie', role: 'Data Scientist', intro_extro_score: 2, creative_technical_score: 4, collaboration_score: 2, interests: ['Machine Learning', 'Python', 'Math'], preferred_format: 'Study Group', preferred_time: 'Weekend' },
  { id: '4', name: 'Diana', role: 'Product Manager', intro_extro_score: 5, creative_technical_score: 3, collaboration_score: 5, interests: ['Strategy', 'Leadership', 'Networking'], preferred_format: 'Mixer', preferred_time: 'Evening' },
  { id: '5', name: 'Eve', role: 'Illustrator', intro_extro_score: 1, creative_technical_score: 1, collaboration_score: 1, interests: ['Drawing', 'Animation', 'Comics'], preferred_format: 'Workshop', preferred_time: 'Weekend' },
  { id: '6', name: 'Frank', role: 'DevOps', intro_extro_score: 3, creative_technical_score: 5, collaboration_score: 3, interests: ['Cloud', 'Linux', 'Security'], preferred_format: 'Tech Talk', preferred_time: 'Evening' },
  { id: '7', name: 'Grace', role: 'Marketing', intro_extro_score: 5, creative_technical_score: 2, collaboration_score: 5, interests: ['Social Media', 'Content', 'Community'], preferred_format: 'Mixer', preferred_time: 'Evening' },
  { id: '8', name: 'Hank', role: 'Backend Dev', intro_extro_score: 2, creative_technical_score: 5, collaboration_score: 2, interests: ['Databases', 'Go', 'Architecture'], preferred_format: 'Study Group', preferred_time: 'Weekend' },
  { id: '9', name: 'Ivy', role: 'UX Researcher', intro_extro_score: 3, creative_technical_score: 2, collaboration_score: 4, interests: ['Psychology', 'Interviews', 'Data'], preferred_format: 'Workshop', preferred_time: 'Evening' },
  { id: '10', name: 'Jack', role: 'Founder', intro_extro_score: 5, creative_technical_score: 3, collaboration_score: 5, interests: ['Startups', 'Pitching', 'Venture Capital'], preferred_format: 'Pitch Night', preferred_time: 'Evening' },
  // Adding more for realistic charts
  ...Array.from({ length: 20 }).map((_, i) => ({
    id: `11_${i}`,
    name: `Member ${i + 11}`,
    role: ['Developer', 'Designer', 'Manager', 'Student'][Math.floor(Math.random() * 4)],
    intro_extro_score: Math.floor(Math.random() * 5) + 1,
    creative_technical_score: Math.floor(Math.random() * 5) + 1,
    collaboration_score: Math.floor(Math.random() * 5) + 1,
    interests: ['Tech', 'Art', 'Business', 'Science'].sort(() => 0.5 - Math.random()).slice(0, 2),
    preferred_format: ['Workshop', 'Mixer', 'Hackathon', 'Study Group'][Math.floor(Math.random() * 4)],
    preferred_time: ['Weekend', 'Evening', 'Weekday Morning'][Math.floor(Math.random() * 3)],
  }))
];

export const mockClusters: Cluster[] = [
  {
    id: 'c1',
    name: 'Quiet Creatives',
    description: 'Introverted, highly creative individuals who prefer focused, small-group interactions.',
    size: 12,
    avg_intro_extro: 1.8,
    avg_creative_technical: 1.5,
    avg_collaboration: 2.1,
    dominant_interests: ['Design', 'Art', 'Writing'],
    recommended_event_type: 'Hands-on Design Workshop',
    recommended_time: 'Weekend Afternoon',
    recommended_group_size: 'Small (5-15)',
    color: '#10b981' // emerald-500
  },
  {
    id: 'c2',
    name: 'Social Tech Builders',
    description: 'Extroverted, technical members who thrive in collaborative, high-energy environments.',
    size: 18,
    avg_intro_extro: 4.2,
    avg_creative_technical: 4.5,
    avg_collaboration: 4.0,
    dominant_interests: ['Coding', 'Startups', 'Hackathons'],
    recommended_event_type: 'Pitch & Prototype Night',
    recommended_time: 'Weekday Evening',
    recommended_group_size: 'Large (30+)',
    color: '#3b82f6' // blue-500
  },
  {
    id: 'c3',
    name: 'Independent Learners',
    description: 'Quiet, technical or skill-focused members who prefer structured, goal-oriented sessions.',
    size: 8,
    avg_intro_extro: 2.0,
    avg_creative_technical: 4.2,
    avg_collaboration: 1.8,
    dominant_interests: ['Data Science', 'Backend', 'Math'],
    recommended_event_type: 'Focused Build Sprint',
    recommended_time: 'Weekend Morning',
    recommended_group_size: 'Medium (15-30)',
    color: '#8b5cf6' // violet-500
  },
  {
    id: 'c4',
    name: 'Community Connectors',
    description: 'Highly social, collaborative members driven by mission and group engagement.',
    size: 15,
    avg_intro_extro: 4.8,
    avg_creative_technical: 2.5,
    avg_collaboration: 4.9,
    dominant_interests: ['Leadership', 'Networking', 'Social Impact'],
    recommended_event_type: 'Volunteer Collaboration Day',
    recommended_time: 'Weekend',
    recommended_group_size: 'Large (30+)',
    color: '#f59e0b' // amber-500
  }
];

export const mockRecommendations: EventRecommendation[] = [
  {
    id: 'r1',
    cluster_id: 'c1',
    title: 'Hands-on Design Workshop',
    format: 'Workshop',
    description: 'A quiet, focused session where members can learn a new design tool or technique with hands-on practice.',
    ideal_size: '10-15',
    ideal_duration: '2 hours',
    why_this_fits: 'Matches their preference for creative tasks and small, low-pressure group settings.',
    energy_level: 'Low/Focused',
    venue_type_needed: 'Studio or Classroom',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800',
    date: 'March 22, 2026',
    price: 25,
    address: '123 Arts Avenue, Studio District, Downtown',
    host: 'Creative Collective Co.',
    details: [
      'Learn Figma design essentials',
      'Hands-on wireframing exercises',
      'Prototype creation workshop',
      'Personal feedback session',
      'Certificate of completion'
    ]
  },
  {
    id: 'r2',
    cluster_id: 'c2',
    title: 'Pitch & Prototype Night',
    format: 'Mini-Hackathon',
    description: 'A high-energy evening where teams form quickly, build a prototype, and pitch it to the group.',
    ideal_size: '30-50',
    ideal_duration: '3-4 hours',
    why_this_fits: 'Perfect for their extroverted, technical nature and desire for collaborative building.',
    energy_level: 'High/Dynamic',
    venue_type_needed: 'Co-working Space or Innovation Hub',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800',
    date: 'March 20, 2026',
    price: 15,
    address: '456 Tech Plaza, Innovation Hub, Midtown',
    host: 'TechStart Community',
    details: [
      'Rapid team formation (5-15 mins)',
      'Focused build session (2 hours)',
      'Live pitch presentations',
      'Networking opportunities with investors',
      'Free food and refreshments'
    ]
  },
  {
    id: 'r3',
    cluster_id: 'c3',
    title: 'Focused Build Sprint',
    format: 'Co-working / Study Group',
    description: 'A dedicated block of time for members to bring their own projects and work alongside others in silence, followed by a brief show-and-tell.',
    ideal_size: '15-20',
    ideal_duration: '3 hours',
    why_this_fits: 'Provides the structure and quiet environment they need to focus on technical skills.',
    energy_level: 'Low/Intense',
    venue_type_needed: 'Library Room or Quiet Lab',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    date: 'March 25, 2026',
    price: 10,
    address: '789 Code Lane, Tech Hub, Downtown',
    host: 'Developer Community Network',
    details: [
      'Quiet work environment',
      'Dedicated project time',
      'Optional pair programming',
      'Show-and-tell session',
      'Snacks and beverages included'
    ]
  },
  {
    id: 'r4',
    cluster_id: 'c4',
    title: 'Community Mixer & Brainstorm',
    format: 'Networking Mixer',
    description: 'An open, unstructured event with facilitated icebreakers and group brainstorming for community initiatives.',
    ideal_size: '40+',
    ideal_duration: '2 hours',
    why_this_fits: 'Leverages their high social energy and desire to connect and collaborate on big ideas.',
    energy_level: 'High/Social',
    venue_type_needed: 'Event Hall or Café Lounge',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800',
    date: 'March 28, 2026',
    price: 20,
    address: '321 Community Hall, Event District, Uptown',
    host: 'Community Connectors Initiative',
    details: [
      'Facilitated icebreaker games',
      'Group brainstorming sessions',
      'Open discussions on community initiatives',
      'Networking with diverse members',
      'Appetizers and drinks provided'
    ]
  }
];

export const mockVenues: Venue[] = [
  {
    id: 'v1',
    name: 'The Greenhouse Co-working',
    type: 'Co-working Space',
    capacity: 60,
    location: 'Downtown',
    indoor_outdoor: 'Indoor',
    suitability_tags: ['Hackathon', 'Mixer', 'Tech'],
    image: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&q=80&w=800',
    suitability_score: 95
  },
  {
    id: 'v2',
    name: 'Central Library Annex',
    type: 'Library Room',
    capacity: 20,
    location: 'Midtown',
    indoor_outdoor: 'Indoor',
    suitability_tags: ['Workshop', 'Study Group', 'Quiet'],
    image: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=800',
    suitability_score: 88
  },
  {
    id: 'v3',
    name: 'Artisan Studio Loft',
    type: 'Studio',
    capacity: 15,
    location: 'Arts District',
    indoor_outdoor: 'Indoor',
    suitability_tags: ['Design', 'Creative', 'Workshop'],
    image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800',
    suitability_score: 92
  },
  {
    id: 'v4',
    name: 'Riverside Park Pavilion',
    type: 'Park Pavilion',
    capacity: 100,
    location: 'Westside',
    indoor_outdoor: 'Outdoor',
    suitability_tags: ['Social', 'Mixer', 'Large Group'],
    image: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&q=80&w=800',
    suitability_score: 85
  }
];
