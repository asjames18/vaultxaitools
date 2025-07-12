import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getUserRole } from '@/lib/auth';

export async function GET() {
  const supabase = await createServerSupabaseClient();

  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();

  // Check admin status
  const role = getUserRole(user);
  if (role !== 'admin') {
    return NextResponse.json({ error: 'User not allowed' }, { status: 403 });
  }

  try {
    // For now, return mock data. In the future, this would fetch from a blog_posts table
    const blogPosts = [
      {
        id: '1',
        title: 'The Future of AI Writing: How ChatGPT is Revolutionizing Content Creation',
        excerpt: 'Discover how AI writing tools are transforming the way we create content.',
        content: 'AI writing tools have fundamentally changed how we approach content creation...',
        author: 'Sarah Johnson',
        date: '2024-01-15',
        category: 'Writing',
        readTime: '5 min read',
        featured: true,
        tags: ['AI Writing', 'ChatGPT', 'Content Creation']
      }
    ];

    return NextResponse.json({ posts: blogPosts });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();

  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();

  // Check admin status
  const role = getUserRole(user);
  if (role !== 'admin') {
    return NextResponse.json({ error: 'User not allowed' }, { status: 403 });
  }

  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.excerpt || !body.content || !body.author) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // In the future, this would insert into a blog_posts table
    const newPost = {
      id: Date.now().toString(),
      ...body,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({ post: newPost, message: 'Blog post created successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const supabase = await createServerSupabaseClient();

  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();

  // Check admin status
  const role = getUserRole(user);
  if (role !== 'admin') {
    return NextResponse.json({ error: 'User not allowed' }, { status: 403 });
  }

  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.id || !body.title || !body.excerpt || !body.content || !body.author) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // In the future, this would update a blog_posts table
    const updatedPost = {
      ...body,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({ post: updatedPost, message: 'Blog post updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const supabase = await createServerSupabaseClient();

  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();

  // Check admin status
  const role = getUserRole(user);
  if (role !== 'admin') {
    return NextResponse.json({ error: 'User not allowed' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Blog post ID is required' }, { status: 400 });
    }

    // In the future, this would delete from a blog_posts table
    return NextResponse.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
} 