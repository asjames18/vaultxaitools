import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { toolId, originalUrl, affiliateUrl, timestamp, userAgent, referrer } = body;

    // Validate required fields
    if (!toolId || !originalUrl || !affiliateUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Store the click data
    const { data, error } = await supabase
      .from('affiliate_clicks')
      .insert([
        {
          tool_id: toolId,
          original_url: originalUrl,
          affiliate_url: affiliateUrl,
          user_agent: userAgent || '',
          referrer: referrer || '',
          ip_address: request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown',
          timestamp: timestamp || new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('Error storing affiliate click:', error);
      return NextResponse.json(
        { error: 'Failed to store click data' },
        { status: 500 }
      );
    }

    // Update tool click count
    await supabase
      .from('tools')
      .update({ 
        affiliate_clicks: supabase.sql`affiliate_clicks + 1`,
        updated_at: new Date().toISOString()
      })
      .eq('id', toolId);

    return NextResponse.json({ 
      success: true, 
      message: 'Click tracked successfully',
      data: data[0]
    });

  } catch (error) {
    console.error('Error in affiliate click tracking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const toolId = searchParams.get('toolId');
    const limit = parseInt(searchParams.get('limit') || '100');

    let query = supabase
      .from('affiliate_clicks')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (toolId) {
      query = query.eq('tool_id', toolId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching affiliate clicks:', error);
      return NextResponse.json(
        { error: 'Failed to fetch click data' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data,
      count: data.length
    });

  } catch (error) {
    console.error('Error in affiliate click retrieval:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 