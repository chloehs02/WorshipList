// Database types matching supabase/schema.sql. Regenerate with:
// npx supabase gen types typescript --project-id <id> > src/lib/supabase/types.ts

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: "leader" | "member" | "admin";
          instrument: string | null;
          avatar_url: string | null;
          team_id: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["users"]["Row"]> & { id: string; name: string; email: string };
        Update: Partial<Database["public"]["Tables"]["users"]["Row"]>;
      };
      songs: {
        Row: {
          id: string;
          slug: string;
          title: string;
          artist: string | null;
          key: string | null;
          bpm: number | null;
          capo: number;
          category: string | null;
          lyrics: string | null;
          chords: string | null;
          notes: string | null;
          tags: string[] | null;
          owner_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["songs"]["Row"]> & { title: string; owner_id: string };
        Update: Partial<Database["public"]["Tables"]["songs"]["Row"]>;
      };
      setlists: {
        Row: {
          id: string;
          title: string;
          date: string | null;
          service_type: string | null;
          notes: string | null;
          created_by: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["setlists"]["Row"]> & { title: string; created_by: string };
        Update: Partial<Database["public"]["Tables"]["setlists"]["Row"]>;
      };
      setlist_songs: {
        Row: {
          id: string;
          setlist_id: string;
          song_id: string;
          order_number: number;
          key_override: string | null;
          notes: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["setlist_songs"]["Row"]> & {
          setlist_id: string;
          song_id: string;
          order_number: number;
        };
        Update: Partial<Database["public"]["Tables"]["setlist_songs"]["Row"]>;
      };
      shared_permissions: {
        Row: {
          id: string;
          song_id: string;
          user_id: string;
          permission_type: "viewer" | "editor";
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["shared_permissions"]["Row"]> & {
          song_id: string;
          user_id: string;
          permission_type: "viewer" | "editor";
        };
        Update: Partial<Database["public"]["Tables"]["shared_permissions"]["Row"]>;
      };
      favorites: {
        Row: { id: string; user_id: string; song_id: string; created_at: string };
        Insert: { user_id: string; song_id: string };
        Update: Partial<{ user_id: string; song_id: string }>;
      };
      share_links: {
        Row: {
          token: string;
          setlist_id: string;
          created_at: string;
        };
        Insert: { token: string; setlist_id: string };
        Update: Partial<{ token: string; setlist_id: string }>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
