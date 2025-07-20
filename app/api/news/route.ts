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

    return NextResponse.json({ 
      data: data || [],
      count: data?.length || 0
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 