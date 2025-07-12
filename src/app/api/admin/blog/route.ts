import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { BlogPost } from '@/data/blog';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Convert frontend format to database format
function convertToDB(post: Partial<BlogPost>) {
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

// Convert database format to frontend format
function convertFromDB(dbPost: any): BlogPost {
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

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching blog posts:', error);
      return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
    }

    const posts = data?.map(convertFromDB) || [];
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error in GET /api/admin/blog:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const postData = convertToDB(body);

    // Set published_at if status is published
    if (postData.status === 'published' && !postData.published_at) {
      postData.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .insert([postData])
      .select()
      .single();

    if (error) {
      console.error('Error creating blog post:', error);
      return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
    }

    const post = convertFromDB(data);
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error in POST /api/admin/blog:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...postData } = body;
    const updateData = convertToDB(postData);

    // Set published_at if status is being changed to published
    if (updateData.status === 'published' && !updateData.published_at) {
      updateData.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating blog post:', error);
      return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
    }

    const post = convertFromDB(data);
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error in PUT /api/admin/blog:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting blog post:', error);
      return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/admin/blog:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 