import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');
    const source = searchParams.get('source');
    const sortBy = searchParams.get('sortBy') || 'published';

    const supabase = await createClient();

    let query = supabase
      .from('ai_news')
      .select('*')
      .order(sortBy === 'published' ? 'published_at' : sortBy === 'engagement' ? 'engagement' : 'read_time', { ascending: false })
      .limit(limit);

    if (category) {
      query = query.eq('category', category);
    }

    if (source) {
      query = query.eq('source', source);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching news:', error);
      return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }

    // Convert snake_case fields to camelCase for frontend
    const transformedData = data?.map(item => ({
      id: item.id,
      title: item.title,
      content: item.content,
      url: item.url,
      source: item.source,
      author: item.author,
      publishedAt: item.published_at, // Convert snake_case to camelCase
      imageUrl: item.image_url,       // Convert snake_case to camelCase
      category: item.category,
      sentiment: item.sentiment,
      topics: item.topics,
      readTime: item.read_time,       // Convert snake_case to camelCase
      engagement: item.engagement,
      createdAt: item.created_at,     // Convert snake_case to camelCase
      updatedAt: item.updated_at      // Convert snake_case to camelCase
    })) || [];

    return NextResponse.json({ 
      data: transformedData,
      count: transformedData.length
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 