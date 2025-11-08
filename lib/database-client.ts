import { createClient } from './supabase';
import { Database } from './database.types';

type Tool = Database['public']['Tables']['tools']['Row'];
type ToolInsert = Database['public']['Tables']['tools']['Insert'];
type ToolUpdate = Database['public']['Tables']['tools']['Update'];

type Category = Database['public']['Tables']['categories']['Row'];
type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
type CategoryUpdate = Database['public']['Tables']['categories']['Update'];

// Static categories data - Church/Media/Ministry focused
const staticCategories = [
  {
    name: "Video Editing",
    icon: "🎬",
    description: "Video editing tools and software for creating professional church and ministry videos",
    count: 0,
    color: "from-blue-500 to-cyan-500",
    popular_tools: ["Adobe Premiere Pro", "Final Cut Pro", "DaVinci Resolve", "Camtasia"]
  },
  {
    name: "Graphics Design",
    icon: "🎨",
    description: "Graphics design tools for creating church graphics, social media posts, and ministry materials",
    count: 0,
    color: "from-purple-500 to-pink-500",
    popular_tools: ["Canva", "Adobe Photoshop", "Adobe Illustrator", "Figma"]
  },
  {
    name: "Social Media",
    icon: "📱",
    description: "Social media management and scheduling tools for church and ministry outreach",
    count: 0,
    color: "from-green-500 to-emerald-500",
    popular_tools: ["Buffer", "Hootsuite", "Later", "Sprout Social"]
  },
  {
    name: "Live Streaming",
    icon: "📺",
    description: "Live streaming platforms and tools for church services and ministry events",
    count: 0,
    color: "from-yellow-500 to-orange-500",
    popular_tools: ["OBS Studio", "Streamlabs", "Restream", "YouTube Live"]
  },
  {
    name: "Audio/Podcasting",
    icon: "🎙️",
    description: "Audio production and podcasting tools for church sermons, podcasts, and ministry content",
    count: 0,
    color: "from-red-500 to-rose-500",
    popular_tools: ["Audacity", "Adobe Audition", "GarageBand", "Reaper"]
  },
  {
    name: "Content Creation",
    icon: "✍️",
    description: "AI-powered content creation tools for writing, blogging, and ministry communications",
    count: 0,
    color: "from-indigo-500 to-blue-500",
    popular_tools: ["ChatGPT", "Grammarly", "Jasper", "Copy.ai"]
  },
  {
    name: "Website Building",
    icon: "🌐",
    description: "Website builders and CMS platforms for church websites and ministry online presence",
    count: 0,
    color: "from-teal-500 to-cyan-500",
    popular_tools: ["WordPress", "Squarespace", "Wix", "Webflow"]
  },
  {
    name: "Email Marketing",
    icon: "📧",
    description: "Email marketing and newsletter tools for church communications and ministry outreach",
    count: 0,
    color: "from-pink-500 to-purple-500",
    popular_tools: ["Mailchimp", "Constant Contact", "ConvertKit", "AWeber"]
  },
  {
    name: "Project Management",
    icon: "📋",
    description: "Project management and planning tools for organizing church events and ministry activities",
    count: 0,
    color: "from-gray-500 to-slate-500",
    popular_tools: ["Asana", "Trello", "Monday.com", "Notion"]
  },
  {
    name: "Communication",
    icon: "💬",
    description: "Communication and messaging tools for church teams and ministry coordination",
    count: 0,
    color: "from-blue-500 to-indigo-500",
    popular_tools: ["Slack", "Microsoft Teams", "Discord", "Zoom"]
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
    
    const existingNames = existingCategories.map((c: any) => c.name);
    const newCategories = staticCategories.filter((cat: any) => !existingNames.includes(cat.name));
    
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