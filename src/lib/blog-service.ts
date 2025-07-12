import { createClient } from '@supabase/supabase-js';
import { BlogPost } from '@/data/blog';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export interface BlogPostFromDB {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  read_time: string;
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
  featured_image?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

// Convert database format to frontend format
function convertFromDB(dbPost: BlogPostFromDB): BlogPost {
  return {
    id: dbPost.id,
    title: dbPost.title,
    slug: dbPost.slug,
    excerpt: dbPost.excerpt,
    content: dbPost.content,
    author: dbPost.author,
    date: dbPost.published_at ? new Date(dbPost.published_at).toISOString().split('T')[0] : '',
    category: dbPost.category,
    readTime: dbPost.read_time,
    featured: dbPost.featured,
    status: dbPost.status,
    image: dbPost.featured_image,
    tags: dbPost.tags || [],
    seoTitle: dbPost.seo_title,
    seoDescription: dbPost.seo_description,
    seoKeywords: dbPost.seo_keywords || [],
    featuredImage: dbPost.featured_image,
    publishedAt: dbPost.published_at,
    createdAt: dbPost.created_at,
    updatedAt: dbPost.updated_at
  };
}

// Convert frontend format to database format
function convertToDB(post: Partial<BlogPost>): Partial<BlogPostFromDB> {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    author: post.author,
    category: post.category,
    read_time: post.readTime,
    featured: post.featured,
    status: post.status,
    tags: post.tags,
    seo_title: post.seoTitle,
    seo_description: post.seoDescription,
    seo_keywords: post.seoKeywords,
    featured_image: post.featuredImage,
    published_at: post.publishedAt
  };
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }

    return data?.map(convertFromDB) || [];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      console.error('Error fetching blog post:', error);
      return null;
    }

    return data ? convertFromDB(data) : null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('category', category)
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching blog posts by category:', error);
      return [];
    }

    return data?.map(convertFromDB) || [];
  } catch (error) {
    console.error('Error fetching blog posts by category:', error);
    return [];
  }
}

export async function searchBlogPosts(query: string): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error searching blog posts:', error);
      return [];
    }

    return data?.map(convertFromDB) || [];
  } catch (error) {
    console.error('Error searching blog posts:', error);
    return [];
  }
}

export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('featured', true)
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching featured blog posts:', error);
      return [];
    }

    return data?.map(convertFromDB) || [];
  } catch (error) {
    console.error('Error fetching featured blog posts:', error);
    return [];
  }
}

export async function getBlogCategories(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('category')
      .eq('status', 'published');

    if (error) {
      console.error('Error fetching blog categories:', error);
      return [];
    }

    const categories = [...new Set(data?.map(post => post.category) || [])];
    return ['All', ...categories];
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return [];
  }
}

// Admin functions (require service role key)
export async function createBlogPost(post: Partial<BlogPost>): Promise<BlogPost | null> {
  try {
    const postData = convertToDB(post);
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .insert([postData])
      .select()
      .single();

    if (error) {
      console.error('Error creating blog post:', error);
      return null;
    }

    return data ? convertFromDB(data) : null;
  } catch (error) {
    console.error('Error creating blog post:', error);
    return null;
  }
}

export async function updateBlogPost(id: string, post: Partial<BlogPost>): Promise<BlogPost | null> {
  try {
    const postData = convertToDB(post);
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .update(postData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating blog post:', error);
      return null;
    }

    return data ? convertFromDB(data) : null;
  } catch (error) {
    console.error('Error updating blog post:', error);
    return null;
  }
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting blog post:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return false;
  }
}

export async function getAllBlogPostsForAdmin(): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all blog posts:', error);
      return [];
    }

    return data?.map(convertFromDB) || [];
  } catch (error) {
    console.error('Error fetching all blog posts:', error);
    return [];
  }
} 