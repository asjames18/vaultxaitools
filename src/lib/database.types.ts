export interface Database {
  public: {
    Tables: {
      tools: {
        Row: {
          id: string
          name: string
          logo: string
          description: string
          long_description: string | null
          category: string
          rating: number
          review_count: number
          weekly_users: number
          growth: string
          website: string
          pricing: string
          features: string[] | null
          pros: string[] | null
          cons: string[] | null
          alternatives: { name: string; rating: number; logo: string }[] | null
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          logo: string
          description: string
          long_description?: string | null
          category: string
          rating?: number
          review_count?: number
          weekly_users?: number
          growth?: string
          website: string
          pricing: string
          features?: string[] | null
          pros?: string[] | null
          cons?: string[] | null
          alternatives?: { name: string; rating: number; logo: string }[] | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          logo?: string
          description?: string
          long_description?: string | null
          category?: string
          rating?: number
          review_count?: number
          weekly_users?: number
          growth?: string
          website?: string
          pricing?: string
          features?: string[] | null
          pros?: string[] | null
          cons?: string[] | null
          alternatives?: { name: string; rating: number; logo: string }[] | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          icon: string
          description: string
          count: number
          color: string
          popular_tools: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          icon: string
          description: string
          count?: number
          color: string
          popular_tools?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          icon?: string
          description?: string
          count?: number
          color?: string
          popular_tools?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          tool_id: string
          user_name: string
          rating: number
          date: string
          comment: string
          helpful: number
          verified: boolean
          created_at: string
        }
        Insert: {
          id?: string
          tool_id: string
          user_name: string
          rating: number
          date?: string
          comment: string
          helpful?: number
          verified?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          tool_id?: string
          user_name?: string
          rating?: number
          date?: string
          comment?: string
          helpful?: number
          verified?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 