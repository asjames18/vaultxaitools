import { createServerSupabaseClient } from './supabase-server';
import { Database } from './database.types';

type Tool = Database['public']['Tables']['tools']['Row'];
type ToolInsert = Database['public']['Tables']['tools']['Insert'];
type ToolUpdate = Database['public']['Tables']['tools']['Update'];

type Category = Database['public']['Tables']['categories']['Row'];
type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
type CategoryUpdate = Database['public']['Tables']['categories']['Update'];

// Tools CRUD operations
export async function getTools(): Promise<Tool[]> {
  const supabase = await createServerSupabaseClient();
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

export async function getToolById(id: string): Promise<Tool | null> {
  const supabase = await createServerSupabaseClient();
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

export async function createTool(tool: ToolInsert): Promise<Tool> {
  const supabase = await createServerSupabaseClient();
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

export async function updateTool(id: string, updates: ToolUpdate): Promise<Tool> {
  const supabase = await createServerSupabaseClient();
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

export async function deleteTool(id: string): Promise<void> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from('tools')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting tool:', error);
    throw error;
  }
}

// Categories CRUD operations
export async function getCategories(): Promise<Category[]> {
  const supabase = await createServerSupabaseClient();
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

export async function getCategoryById(id: string): Promise<Category | null> {
  const supabase = await createServerSupabaseClient();
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

export async function createCategory(category: CategoryInsert): Promise<Category> {
  const supabase = await createServerSupabaseClient();
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

export async function updateCategory(id: string, updates: CategoryUpdate): Promise<Category> {
  const supabase = await createServerSupabaseClient();
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

export async function deleteCategory(id: string): Promise<void> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}

// Helper functions
export async function getToolsByCategory(category: string): Promise<Tool[]> {
  const supabase = await createServerSupabaseClient();
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

export async function searchTools(query: string): Promise<Tool[]> {
  const supabase = await createServerSupabaseClient();
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