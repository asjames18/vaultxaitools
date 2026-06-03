export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      tools: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          long_description?: string | null;
          category: string | null;
          website: string | null;
          logo: string | null;
          rating: number | null;
          review_count: number | null;
          weekly_users: number | null;
          growth?: string | null;
          pricing?: string | null;
          features?: string[] | null;
          pros?: string[] | null;
          cons?: string[] | null;
          alternatives?: Json | null;
          tags?: string[] | null;
          status: string | null;
          created_at: string | null;
          updated_at: string | null;
          [key: string]: Json | string | number | string[] | null | undefined;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          category?: string | null;
          website?: string | null;
          logo?: string | null;
          rating?: number | null;
          review_count?: number | null;
          weekly_users?: number | null;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['tools']['Insert']>;
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          icon: string | null;
          count?: number | null;
          color?: string | null;
          popular_tools?: string[] | null;
          created_at: string | null;
          updated_at: string | null;
          [key: string]: Json | string | number | string[] | null | undefined;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          icon?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['categories']['Insert']>;
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          tool_id: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          tool_id: string;
          created_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['favorites']['Insert']>;
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string;
          author: string;
          category: string | null;
          read_time: number | null;
          featured: boolean | null;
          status: string | null;
          tags: string[] | null;
          seo_title: string | null;
          seo_description: string | null;
          seo_keywords: string[] | null;
          featured_image: string | null;
          published_at: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content: string;
          author: string;
          category?: string | null;
          read_time?: number | null;
          featured?: boolean | null;
          status?: string | null;
          tags?: string[] | null;
          seo_title?: string | null;
          seo_description?: string | null;
          seo_keywords?: string[] | null;
          featured_image?: string | null;
          published_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['blog_posts']['Insert']>;
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['user_roles']['Insert']>;
      };
      profiles: {
        Row: {
          id: string;
          user_id: string;
          display_name: string | null;
          bio: string | null;
          avatar_url: string | null;
          points: number | null;
          level: string | null;
          skill_level: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null;
          interests: string[] | null;
          learning_path: string | null;
          streak_count: number | null;
          last_active_date: string | null;
          total_tools_viewed: number | null;
          organization: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          display_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          points?: number | null;
          level?: string | null;
          skill_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null;
          interests?: string[] | null;
          learning_path?: string | null;
          streak_count?: number | null;
          last_active_date?: string | null;
          total_tools_viewed?: number | null;
          organization?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      user_activity: {
        Row: {
          id: string;
          user_id: string;
          action: string;
          tool_id: string | null;
          tool_name: string | null;
          metadata: Json | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          action: string;
          tool_id?: string | null;
          tool_name?: string | null;
          metadata?: Json | null;
          created_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['user_activity']['Insert']>;
      };
      reviews: {
        Row: {
          id: string;
          tool_id: string;
          user_id: string | null;
          rating: number;
          comment: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          tool_id: string;
          user_id?: string | null;
          rating: number;
          comment?: string | null;
          created_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>;
      };
      users: {
        Row: {
          id: string;
          email: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          email?: string | null;
          created_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      achievements: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string;
          icon: string;
          category: 'discovery' | 'learning' | 'community' | 'streak' | 'milestone';
          points_reward: number;
          requirement_type: string;
          requirement_value: number;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description: string;
          icon: string;
          category: 'discovery' | 'learning' | 'community' | 'streak' | 'milestone';
          points_reward?: number;
          requirement_type: string;
          requirement_value?: number;
          created_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['achievements']['Insert']>;
      };
      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          earned_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_id: string;
          earned_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['user_achievements']['Insert']>;
      };
      user_recommendations: {
        Row: {
          id: string;
          user_id: string;
          tool_id: string;
          score: number;
          reason: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          tool_id: string;
          score?: number;
          reason?: string | null;
          created_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['user_recommendations']['Insert']>;
      };
    };
  };
}
