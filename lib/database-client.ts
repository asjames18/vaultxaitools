import { createClient } from './supabase';
import { Database } from './database.types';

type Tool = Database['public']['Tables']['tools']['Row'];
type ToolInsert = Database['public']['Tables']['tools']['Insert'];
type ToolUpdate = Database['public']['Tables']['tools']['Update'];

type Category = Database['public']['Tables']['categories']['Row'];
type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
type CategoryUpdate = Database['public']['Tables']['categories']['Update'];

// Static categories data - Melanated In Tech tech education focus
const staticCategories = [
  {
    name: "AI Tools",
    icon: "🤖",
    description: "Artificial intelligence tools for writing, research, image generation, and productivity",
    count: 0,
    color: "from-green-500 to-emerald-500",
    popular_tools: ["ChatGPT", "Claude", "Gemini", "Perplexity AI"]
  },
  {
    name: "AI Agents",
    icon: "⚡",
    description: "Autonomous AI agent platforms that plan, reason, and execute multi-step tasks",
    count: 0,
    color: "from-violet-500 to-purple-500",
    popular_tools: ["AutoGPT", "CrewAI", "LangChain", "n8n"]
  },
  {
    name: "Automation",
    icon: "🔄",
    description: "Workflow automation and integration tools to streamline tasks and connect apps",
    count: 0,
    color: "from-blue-500 to-cyan-500",
    popular_tools: ["Zapier", "Make", "n8n", "Power Automate"]
  },
  {
    name: "Development Tools",
    icon: "💻",
    description: "Code editors, AI coding assistants, and platforms for building apps and automations",
    count: 0,
    color: "from-orange-500 to-amber-500",
    popular_tools: ["GitHub Copilot", "Cursor", "Replit", "Vercel"]
  },
  {
    name: "Content Creation",
    icon: "✍️",
    description: "AI-powered tools for writing, video, audio, graphics, and digital content production",
    count: 0,
    color: "from-indigo-500 to-blue-500",
    popular_tools: ["ChatGPT", "Runway", "ElevenLabs", "Descript"]
  },
  {
    name: "Productivity",
    icon: "🚀",
    description: "Productivity and project management tools to stay organized, focused, and efficient",
    count: 0,
    color: "from-pink-500 to-rose-500",
    popular_tools: ["Notion", "Obsidian", "Todoist", "ClickUp"]
  },
  {
    name: "Social Media",
    icon: "📱",
    description: "Social media management and scheduling tools for creators, brands, and entrepreneurs",
    count: 0,
    color: "from-green-500 to-teal-500",
    popular_tools: ["Buffer", "Hootsuite", "Later", "Sprout Social"]
  },
  {
    name: "Email Marketing",
    icon: "📧",
    description: "Email marketing and newsletter tools for building and nurturing your audience",
    count: 0,
    color: "from-pink-500 to-purple-500",
    popular_tools: ["Mailchimp", "ConvertKit", "Beehiiv", "MailerLite"]
  },
  {
    name: "Website Building",
    icon: "🌐",
    description: "Website builders, CMS platforms, and no-code tools for building your online presence",
    count: 0,
    color: "from-teal-500 to-cyan-500",
    popular_tools: ["WordPress", "Webflow", "Framer", "Squarespace"]
  },
  {
    name: "Communication",
    icon: "💬",
    description: "Communication and collaboration tools for remote teams, communities, and creators",
    count: 0,
    color: "from-blue-500 to-indigo-500",
    popular_tools: ["Slack", "Discord", "Microsoft Teams", "Zoom"]
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