/**
 * Shared Tool and Category types for UI and services.
 * Runtime data comes from Supabase; see data/tools.ts for seed data only.
 */

export interface Tool {
  id: string;
  name: string;
  logo: string;
  description: string;
  longDescription?: string;
  category: string;
  rating: number;
  reviewCount: number;
  weeklyUsers: number;
  growth: string;
  website: string;
  pricing: string;
  features?: string[];
  pros?: string[];
  cons?: string[];
  alternatives?: { id?: string; name: string; rating: number; logo: string }[];
  tags?: string[];
  useCases?: { title: string; prompt: string; description?: string; notes?: string }[];
  quickStart?: string[];
  integrations?: { name: string; logo?: string; note?: string }[];
  faq?: { q: string; a: string }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  name: string;
  icon: string;
  description: string;
  count: number;
  color: string;
  popularTools: string[];
}

export function mapDbToolToTool(row: {
  id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  website?: string | null;
  logo?: string | null;
  rating?: number | null;
  review_count?: number | null;
  weekly_users?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
}): Tool {
  return {
    id: row.id,
    name: row.name,
    logo: row.logo || '🔧',
    description: row.description || '',
    category: row.category || 'Uncategorized',
    rating: row.rating ?? 0,
    reviewCount: row.review_count ?? 0,
    weeklyUsers: row.weekly_users ?? 0,
    growth: '0%',
    website: row.website || '',
    pricing: 'Unknown',
    createdAt: row.created_at ?? undefined,
    updatedAt: row.updated_at ?? undefined,
  };
}
