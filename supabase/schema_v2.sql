-- ============================================================
-- CommunityIQ Phase 2 – Big Five Personality + Organizer Tools
-- Run this in Supabase SQL Editor AFTER the original schema.sql
-- ============================================================

-- 1. Extend profiles with Big Five scores, role, interests, organizer flag
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS extraversion       FLOAT DEFAULT 0.5,
  ADD COLUMN IF NOT EXISTS agreeableness      FLOAT DEFAULT 0.5,
  ADD COLUMN IF NOT EXISTS conscientiousness  FLOAT DEFAULT 0.5,
  ADD COLUMN IF NOT EXISTS openness           FLOAT DEFAULT 0.5,
  ADD COLUMN IF NOT EXISTS emotional_stability FLOAT DEFAULT 0.5,
  ADD COLUMN IF NOT EXISTS community_role     TEXT DEFAULT 'Participant',
  ADD COLUMN IF NOT EXISTS interests          TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS availability       JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS timezone           TEXT DEFAULT 'UTC',
  ADD COLUMN IF NOT EXISTS is_organizer       BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS consent_profile    BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS consent_date       TIMESTAMPTZ;

-- 2. Communities table
CREATE TABLE IF NOT EXISTS public.communities (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  admin_user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  avg_extraversion FLOAT DEFAULT 0,
  avg_agreeableness FLOAT DEFAULT 0,
  avg_conscientiousness FLOAT DEFAULT 0,
  avg_openness FLOAT DEFAULT 0,
  avg_emotional_stability FLOAT DEFAULT 0
);

ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read communities" ON public.communities;
CREATE POLICY "Anyone can read communities"
  ON public.communities FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can insert communities" ON public.communities;
CREATE POLICY "Admins can insert communities"
  ON public.communities FOR INSERT
  WITH CHECK (auth.uid() = admin_user_id);

DROP POLICY IF EXISTS "Admins can update own communities" ON public.communities;
CREATE POLICY "Admins can update own communities"
  ON public.communities FOR UPDATE
  USING (auth.uid() = admin_user_id);

-- 3. Events table with personality profile
CREATE TABLE IF NOT EXISTS public.events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  community_id BIGINT REFERENCES public.communities(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  date DATE,
  start_time TIME,
  end_time TIME,
  location TEXT,
  location_type TEXT DEFAULT 'in-person',
  tags TEXT[] DEFAULT '{}',
  expected_energy TEXT DEFAULT 'medium',
  capacity INT DEFAULT 50,
  personality_profile FLOAT[] DEFAULT '{0.5,0.5,0.5,0.5,0.5}',
  image TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read events" ON public.events;
CREATE POLICY "Anyone can read events"
  ON public.events FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert events" ON public.events;
CREATE POLICY "Authenticated users can insert events"
  ON public.events FOR INSERT
  WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Creators can update own events" ON public.events;
CREATE POLICY "Creators can update own events"
  ON public.events FOR UPDATE
  USING (auth.uid() = created_by);

-- 4. Attendance tracking
CREATE TABLE IF NOT EXISTS public.attendance (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id BIGINT REFERENCES public.events(id) ON DELETE CASCADE,
  rsvp BOOLEAN DEFAULT false,
  attended BOOLEAN DEFAULT false,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (user_id, event_id)
);

ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own attendance" ON public.attendance;
CREATE POLICY "Users can read own attendance"
  ON public.attendance FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own attendance" ON public.attendance;
CREATE POLICY "Users can insert own attendance"
  ON public.attendance FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own attendance" ON public.attendance;
CREATE POLICY "Users can update own attendance"
  ON public.attendance FOR UPDATE
  USING (auth.uid() = user_id);

-- 5. Consent audit log (GDPR)
CREATE TABLE IF NOT EXISTS public.consent_logs (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL,
  granted BOOLEAN NOT NULL DEFAULT false,
  consent_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (user_id, consent_type)
);

ALTER TABLE public.consent_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own consent" ON public.consent_logs;
CREATE POLICY "Users can read own consent"
  ON public.consent_logs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own consent" ON public.consent_logs;
CREATE POLICY "Users can insert own consent"
  ON public.consent_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own consent" ON public.consent_logs;
CREATE POLICY "Users can update own consent"
  ON public.consent_logs FOR UPDATE
  USING (auth.uid() = user_id);

-- 6. Useful indexes
CREATE INDEX IF NOT EXISTS idx_events_tags ON public.events USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events (date);
CREATE INDEX IF NOT EXISTS idx_attendance_event ON public.attendance (event_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles (community_role);

-- 7. Seed one default community
INSERT INTO public.communities (name, description)
VALUES ('CommunityIQ Default', 'The default community for all CommunityIQ members.')
ON CONFLICT DO NOTHING;

-- 8. Seed demo events (12 events with personality profiles [E,A,C,O,S])
INSERT INTO public.events (title, description, date, start_time, end_time, location, location_type, tags, expected_energy, capacity, personality_profile, image) VALUES
  ('Sustainable Design Hackathon', 'A 24-hour hackathon focused on sustainable design solutions with Siemens mentors.', '2026-04-13', '09:00', '18:00', 'Baku, Azerbaijan', 'in-person', ARRAY['hackathon','sustainability','design'], 'high', 60, ARRAY[0.3,0.5,0.8,0.9,0.4], 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800'),
  ('AI Ideation Hackathon', 'Teams prototype AI ideas in a 6-hour sprint. Demo and pitch at the end.', '2026-04-20', '12:00', '18:00', 'Baku, Innovation Hub', 'in-person', ARRAY['hackathon','AI','prototyping'], 'high', 50, ARRAY[0.4,0.5,0.7,0.9,0.4], 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800'),
  ('Startup Demo Night', 'Members present startup ideas in 3-minute pitches and get live feedback from investors.', '2026-04-28', '18:00', '21:00', 'Silicon Valley-style Hub, Baku', 'in-person', ARRAY['startups','pitching','networking'], 'high', 80, ARRAY[0.9,0.8,0.4,0.7,0.6], 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800'),
  ('ProductTank: Orchestrating AI Agents', 'Expert talk on building and managing AI agent workflows in product teams.', '2026-05-11', '18:30', '20:30', 'Caspian Plaza, Baku', 'in-person', ARRAY['talk','AI','product','management'], 'medium', 40, ARRAY[0.4,0.5,0.7,0.9,0.5], 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800'),
  ('Tech Networking Mixer', 'Casual evening networking for career tips and building connections in tech.', '2026-05-05', '18:00', '21:00', 'Startup Hub, Baku', 'in-person', ARRAY['networking','career','social'], 'high', 100, ARRAY[0.9,0.9,0.3,0.2,0.4], 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=800'),
  ('Open Source Sprint', 'Bring your own OSS project and code alongside mentors. Pair programming welcome.', '2026-05-12', '10:00', '16:00', 'Co-working Space, Baku', 'in-person', ARRAY['coding','workshop','OSS','mentorship'], 'low', 25, ARRAY[0.3,0.7,0.9,0.3,0.7], 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800'),
  ('Mobile Dev Workshop', 'Hands-on workshop covering iOS and Android development with Flutter.', '2026-05-20', '14:00', '17:00', 'Online', 'online', ARRAY['workshop','mobile','iOS','Android','Flutter'], 'medium', 60, ARRAY[0.4,0.4,0.8,0.5,0.6], 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800'),
  ('UX Design Brainstorm', 'Collaborative brainstorming session for UX challenges. Bring your sticky notes!', '2026-06-02', '15:00', '18:00', 'Design Lab, Baku', 'in-person', ARRAY['workshop','UX','design','brainstorm'], 'medium', 20, ARRAY[0.3,0.6,0.6,0.8,0.5], 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800'),
  ('Career Fair for Students', 'University career fair connecting students with tech companies in Baku.', '2026-06-15', '10:00', '16:00', 'University Campus, Baku', 'in-person', ARRAY['fair','career','students','resumes'], 'medium', 200, ARRAY[0.7,0.8,0.5,0.4,0.6], 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=800'),
  ('Virtual Coding Challenge', 'Online coding competition with AI-powered problem sets and real-time leaderboard.', '2026-06-20', '09:00', '15:00', 'Online', 'online', ARRAY['competition','coding','AI','algorithms'], 'high', 150, ARRAY[0.4,0.5,0.7,0.9,0.4], 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&q=80&w=800'),
  ('Leadership Seminar', 'Full-day seminar on leadership and soft skills for tech professionals.', '2026-07-01', '09:00', '17:00', 'Hotel Conference Room, Baku', 'in-person', ARRAY['seminar','leadership','softskills','management'], 'medium', 60, ARRAY[0.6,0.7,0.8,0.5,0.8], 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800'),
  ('Community Mixer & Brainstorm', 'Open mixer with facilitated icebreakers and group brainstorming for community initiatives.', '2026-07-10', '17:00', '20:00', 'Event Hall, Baku', 'in-person', ARRAY['networking','brainstorm','community','social'], 'high', 80, ARRAY[0.8,0.9,0.3,0.5,0.5], 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=800')
ON CONFLICT DO NOTHING;
