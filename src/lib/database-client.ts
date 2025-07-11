import { createClient } from './supabase';
import { Database } from './database.types';

type Tool = Database['public']['Tables']['tools']['Row'];
type ToolInsert = Database['public']['Tables']['tools']['Insert'];
type ToolUpdate = Database['public']['Tables']['tools']['Update'];

type Category = Database['public']['Tables']['categories']['Row'];
type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
type CategoryUpdate = Database['public']['Tables']['categories']['Update'];

type Review = Database['public']['Tables']['reviews']['Row'];
type ReviewInsert = Database['public']['Tables']['reviews']['Insert'];
type ReviewUpdate = Database['public']['Tables']['reviews']['Update'];

// Client-side Tools CRUD operations
export async function getToolsClient(): Promise<Tool[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tools:', error);
    throw error;
  }

  return data || [];
}

export async function getToolByIdClient(id: string): Promise<Tool | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching tool:', error);
    return null;
  }

  return data;
}

export async function createToolClient(tool: ToolInsert): Promise<Tool> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('tools')
    .insert(tool)
    .select()
    .single();

  if (error) {
    console.error('Error creating tool:', error);
    throw error;
  }

  return data;
}

export async function updateToolClient(id: string, updates: ToolUpdate): Promise<Tool> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('tools')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating tool:', error);
    throw error;
  }

  return data;
}

export async function deleteToolClient(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('tools')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting tool:', error);
    throw error;
  }
}

// Client-side Categories CRUD operations
export async function getCategoriesClient(): Promise<Category[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }

  return data || [];
}

export async function getCategoryByIdClient(id: string): Promise<Category | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching category:', error);
    return null;
  }

  return data;
}

export async function createCategoryClient(category: CategoryInsert): Promise<Category> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('categories')
    .insert(category)
    .select()
    .single();

  if (error) {
    console.error('Error creating category:', error);
    throw error;
  }

  return data;
}

export async function updateCategoryClient(id: string, updates: CategoryUpdate): Promise<Category> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('categories')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating category:', error);
    throw error;
  }

  return data;
}

export async function deleteCategoryClient(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}

// Client-side Helper functions
export async function getToolsByCategoryClient(category: string): Promise<Tool[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .eq('category', category)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching tools by category:', error);
    throw error;
  }

  return data || [];
}

export async function searchToolsClient(query: string): Promise<Tool[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error searching tools:', error);
    throw error;
  }

  return data || [];
}

// Review functions
export async function getReviewsByToolIdClient(toolId: string): Promise<Review[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('tool_id', toolId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }

  return data || [];
}

export async function addReviewClient(review: ReviewInsert): Promise<Review> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('reviews')
    .insert(review)
    .select()
    .single();

  if (error) {
    console.error('Error adding review:', error);
    throw error;
  }

  return data;
}

export async function updateReviewHelpfulClient(reviewId: string, helpful: number): Promise<Review> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('reviews')
    .update({ helpful })
    .eq('id', reviewId)
    .select()
    .single();

  if (error) {
    console.error('Error updating review helpful count:', error);
    throw error;
  }

  return data;
}

export async function updateToolRatingClient(toolId: string, rating: number, reviewCount: number): Promise<Tool> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('tools')
    .update({ rating, review_count: reviewCount })
    .eq('id', toolId)
    .select()
    .single();

  if (error) {
    console.error('Error updating tool rating:', error);
    throw error;
  }

  return data;
} 