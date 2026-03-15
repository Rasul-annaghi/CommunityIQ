export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          created_at: string;
          extraversion: number;
          agreeableness: number;
          conscientiousness: number;
          openness: number;
          emotional_stability: number;
          community_role: string;
          interests: string[];
          availability: Json;
          timezone: string;
          is_organizer: boolean;
          consent_profile: boolean;
          consent_date: string | null;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          created_at?: string;
          extraversion?: number;
          agreeableness?: number;
          conscientiousness?: number;
          openness?: number;
          emotional_stability?: number;
          community_role?: string;
          interests?: string[];
          availability?: Json;
          timezone?: string;
          is_organizer?: boolean;
          consent_profile?: boolean;
          consent_date?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          created_at?: string;
          extraversion?: number;
          agreeableness?: number;
          conscientiousness?: number;
          openness?: number;
          emotional_stability?: number;
          community_role?: string;
          interests?: string[];
          availability?: Json;
          timezone?: string;
          is_organizer?: boolean;
          consent_profile?: boolean;
          consent_date?: string | null;
        };
      };
      quiz_submissions: {
        Row: {
          id: string;
          user_id: string;
          answers: Json;
          archetype: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          answers: Json;
          archetype: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          answers?: Json;
          archetype?: string;
          created_at?: string;
        };
      };
      communities: {
        Row: {
          id: number;
          name: string;
          description: string | null;
          admin_user_id: string | null;
          created_at: string;
          avg_extraversion: number;
          avg_agreeableness: number;
          avg_conscientiousness: number;
          avg_openness: number;
          avg_emotional_stability: number;
        };
        Insert: {
          name: string;
          description?: string | null;
          admin_user_id?: string | null;
          avg_extraversion?: number;
          avg_agreeableness?: number;
          avg_conscientiousness?: number;
          avg_openness?: number;
          avg_emotional_stability?: number;
        };
        Update: {
          name?: string;
          description?: string | null;
          admin_user_id?: string | null;
          avg_extraversion?: number;
          avg_agreeableness?: number;
          avg_conscientiousness?: number;
          avg_openness?: number;
          avg_emotional_stability?: number;
        };
      };
      events: {
        Row: {
          id: number;
          community_id: number | null;
          title: string;
          description: string | null;
          date: string | null;
          start_time: string | null;
          end_time: string | null;
          location: string | null;
          location_type: string;
          tags: string[];
          expected_energy: string;
          capacity: number;
          personality_profile: number[];
          image: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          community_id?: number | null;
          title: string;
          description?: string | null;
          date?: string | null;
          start_time?: string | null;
          end_time?: string | null;
          location?: string | null;
          location_type?: string;
          tags?: string[];
          expected_energy?: string;
          capacity?: number;
          personality_profile?: number[];
          image?: string | null;
          created_by?: string | null;
        };
        Update: {
          community_id?: number | null;
          title?: string;
          description?: string | null;
          date?: string | null;
          start_time?: string | null;
          end_time?: string | null;
          location?: string | null;
          location_type?: string;
          tags?: string[];
          expected_energy?: string;
          capacity?: number;
          personality_profile?: number[];
          image?: string | null;
          created_by?: string | null;
        };
      };
      attendance: {
        Row: {
          user_id: string;
          event_id: number;
          rsvp: boolean;
          attended: boolean;
          rating: number | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          event_id: number;
          rsvp?: boolean;
          attended?: boolean;
          rating?: number | null;
        };
        Update: {
          rsvp?: boolean;
          attended?: boolean;
          rating?: number | null;
        };
      };
      consent_logs: {
        Row: {
          user_id: string;
          consent_type: string;
          granted: boolean;
          consent_date: string;
        };
        Insert: {
          user_id: string;
          consent_type: string;
          granted: boolean;
        };
        Update: {
          granted?: boolean;
        };
      };
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type QuizSubmission = Database['public']['Tables']['quiz_submissions']['Row'];
export type QuizSubmissionInsert = Database['public']['Tables']['quiz_submissions']['Insert'];
export type Community = Database['public']['Tables']['communities']['Row'];
export type Event = Database['public']['Tables']['events']['Row'];
export type EventInsert = Database['public']['Tables']['events']['Insert'];
export type Attendance = Database['public']['Tables']['attendance']['Row'];
