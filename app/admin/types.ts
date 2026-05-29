export type AdminTab =
  | 'tools'
  | 'categories'
  | 'sponsored'
  | 'signup'
  | 'users'
  | 'contact'
  | 'automation'
  | 'performance'
  | 'search'
  | 'workflows'
  | 'accessibility'
  | 'data'
  | 'quality';

export interface AdminTool {
  id: string;
  name: string;
  description?: string;
  category?: string;
  website?: string;
  logo?: string;
  rating?: number;
  review_count?: number;
  weekly_users?: number;
  created_at?: string;
  updated_at?: string;
  status?: 'draft' | 'published' | 'archived';
}

export interface AdminCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  created_at?: string;
}

export type AdminMessage = { type: 'success' | 'error'; text: string } | null;
