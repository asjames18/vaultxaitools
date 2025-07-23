import { createClient } from './supabase';
import { Database } from './database.types';

type Tool = Database['public']['Tables']['tools']['Row'];
type ToolInsert = Database['public']['Tables']['tools']['Insert'];
type ToolUpdate = Database['public']['Tables']['tools']['Update'];

type Category = Database['public']['Tables']['categories']['Row'];
type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
type CategoryUpdate = Database['public']['Tables']['categories']['Update'];

// Static categories data
const staticCategories = [
  {
    name: "Language",
    icon: "💬",
    description: "AI tools for text generation, translation, and language processing",
    count: 45,
    color: "from-blue-500 to-cyan-500",
    popular_tools: ["ChatGPT", "Claude", "Bard", "Perplexity"]
  },
  {
    name: "Design",
    icon: "🎨",
    description: "AI-powered design tools for graphics, UI/UX, and creative work",
    count: 38,
    color: "from-purple-500 to-pink-500",
    popular_tools: ["Midjourney", "DALL-E", "Stable Diffusion", "Canva AI"]
  },
  {
    name: "Development",
    icon: "💻",
    description: "AI tools for coding, debugging, and software development",
    count: 52,
    color: "from-green-500 to-emerald-500",
    popular_tools: ["GitHub Copilot", "Cursor", "Tabnine", "CodeWhisperer"]
  },
  {
    name: "Productivity",
    icon: "⚡",
    description: "AI assistants and tools to boost your productivity",
    count: 29,
    color: "from-yellow-500 to-orange-500",
    popular_tools: ["Notion AI", "Grammarly", "Otter.ai", "Fireflies"]
  },
  {
    name: "Marketing",
    icon: "📈",
    description: "AI tools for marketing, advertising, and business growth",
    count: 31,
    color: "from-red-500 to-rose-500",
    popular_tools: ["Jasper", "Copy.ai", "Surfer SEO", "Phrasee"]
  },
  {
    name: "Writing",
    icon: "✍️",
    description: "AI writing assistants and content creation tools",
    count: 27,
    color: "from-indigo-500 to-blue-500",
    popular_tools: ["Grammarly", "Hemingway", "ProWritingAid", "Wordtune"]
  },
  {
    name: "Video",
    icon: "🎬",
    description: "AI tools for video creation, editing, and generation",
    count: 23,
    color: "from-pink-500 to-purple-500",
    popular_tools: ["Runway", "Synthesia", "Lumen5", "Pictory"]
  },
  {
    name: "Audio",
    icon: "🎵",
    description: "AI tools for audio processing, music generation, and voice synthesis",
    count: 19,
    color: "from-teal-500 to-cyan-500",
    popular_tools: ["Mubert", "Amper Music", "Descript", "Synthesia"]
  },
  {
    name: "Data",
    icon: "📊",
    description: "AI tools for data analysis, visualization, and insights",
    count: 34,
    color: "from-gray-500 to-slate-500",
    popular_tools: ["Tableau", "Power BI", "Looker", "Metabase"]
  }
];

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

// Sync categories from static data to database
export async function syncCategoriesClient(): Promise<{ added: number; total: number }> {
  const supabase = createClient();
  
  try {
    // Get existing categories
    const { data: existingCategories, error: fetchError } = await supabase
      .from('categories')
      .select('name');
    
    if (fetchError) {
      console.error('Error fetching existing categories:', fetchError);
      throw fetchError;
    }
    
    const existingNames = existingCategories.map(c => c.name);
    const newCategories = staticCategories.filter(cat => !existingNames.includes(cat.name));
    
    if (newCategories.length === 0) {
      console.log('All categories already exist in the database!');
      return { added: 0, total: existingCategories.length };
    }
    
    // Insert new categories
    const { data: insertedCategories, error: insertError } = await supabase
      .from('categories')
      .insert(newCategories)
      .select();
    
    if (insertError) {
      console.error('Error inserting categories:', insertError);
      throw insertError;
    }
    
    console.log(`Successfully added ${insertedCategories.length} categories!`);
    
    // Get total count
    const { data: allCategories, error: countError } = await supabase
      .from('categories')
      .select('*');
    
    if (countError) {
      console.error('Error counting categories:', countError);
      throw countError;
    }
    
    return { 
      added: insertedCategories.length, 
      total: allCategories.length 
    };
    
  } catch (error) {
    console.error('Error syncing categories:', error);
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
export async function getReviewsByToolIdClient(toolId: string): Promise<Database['public']['Tables']['reviews']['Row'][]> {
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

export async function addReviewClient(review: Database['public']['Tables']['reviews']['Insert']): Promise<Database['public']['Tables']['reviews']['Row']> {
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

export async function updateReviewHelpfulClient(reviewId: string, helpful: number): Promise<Database['public']['Tables']['reviews']['Row']> {
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

// Cache management utilities
export async function invalidateToolsCache(): Promise<boolean> {
  try {
    const response = await fetch('/api/admin/refresh-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'tools', contentId: 'all' })
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error invalidating tools cache:', error);
    return false;
  }
}

// Force refresh tools data with cache busting
export async function refreshToolsData(): Promise<Tool[]> {
  try {
    const supabase = createClient();
    
    // Force fresh data by using a timestamp
    const timestamp = Date.now();
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1000); // Reasonable limit
    
    if (error) {
      console.error('Error refreshing tools data:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in refreshToolsData:', error);
    throw error;
  }
}

// Real-time subscription setup for tools updates
export function subscribeToToolsUpdates(callback: (payload: any) => void) {
  const supabase = createClient();
  
  const subscription = supabase
    .channel('tools-updates')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'tools' 
      }, 
      callback
    )
    .subscribe();
    
  return subscription;
}

// Calculate real-time stats from tools data
export function calculateRealTimeStats(tools: Tool[]) {
  const stats = {
    totalTools: tools.length,
    totalReviews: tools.reduce((sum, tool) => sum + (tool.review_count || 0), 0),
    totalUsers: tools.reduce((sum, tool) => sum + (tool.weekly_users || 0), 0),
    totalCategories: new Set(tools.map(tool => tool.category)).size,
    avgRating: tools.length > 0 
      ? tools.reduce((sum, tool) => sum + (tool.rating || 0), 0) / tools.length 
      : 0,
    lastUpdated: new Date().toISOString()
  };
  
  return stats;
} 