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
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          created_at?: string;
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
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type QuizSubmission = Database['public']['Tables']['quiz_submissions']['Row'];
export type QuizSubmissionInsert = Database['public']['Tables']['quiz_submissions']['Insert'];
