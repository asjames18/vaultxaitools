import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { publicEventRateLimiter } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  try {
    // Rate limit public review submissions
    const limit = publicEventRateLimiter(request);
    if (limit) return limit;

    const supabase = await createClient();
    const body = await request.json();

    const {
      tool_id,
      user_name,
      user_email,
      rating,
      title,
      content,
      pros,
      cons,
      use_case,
      experience_level
    } = body;

    // Validate required fields
    if (!tool_id || !user_name || !rating || !title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Validate content length
    if (content.length < 50) {
      return NextResponse.json(
        { error: 'Review content must be at least 50 characters' },
        { status: 400 }
      );
    }

    // Insert the review
    const { data: review, error } = await supabase
      .from('reviews')
      .insert([
        {
          tool_id,
          user_name: user_name.trim(),
          user_email: user_email?.trim() || null,
          rating,
          title: title.trim(),
          content: content.trim(),
          pros: pros?.filter((p: string) => p.trim()) || [],
          cons: cons?.filter((c: string) => c.trim()) || [],
          use_case: use_case?.trim() || null,
          experience_level: experience_level || 'intermediate',
          verified_user: false, // Can be updated later if email verification is implemented
          status: 'active'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error inserting review:', error);
      return NextResponse.json(
        { error: 'Failed to submit review' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Review submitted successfully',
      review
    });

  } catch (error) {
    console.error('Error in review submission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
    const toolId = searchParams.get('tool_id');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sortBy = searchParams.get('sort_by') || 'created_at';
    const sortOrder = searchParams.get('sort_order') || 'desc';

    if (!toolId) {
      return NextResponse.json(
        { error: 'Tool ID is required' },
        { status: 400 }
      );
    }

    // Build the query
    let query = supabase
      .from('reviews')
      .select('*')
      .eq('tool_id', toolId)
      .eq('status', 'active')
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1);

    const { data: reviews, error, count } = await query;

    if (error) {
      console.error('Error fetching reviews:', error);
      return NextResponse.json(
        { error: 'Failed to fetch reviews' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      reviews: reviews || [],
      total: count || 0,
      limit,
      offset
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
