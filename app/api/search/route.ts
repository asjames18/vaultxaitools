import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const pricing = searchParams.get('pricing') || '';
    const rating = searchParams.get('rating') || '';
    const weeklyUsers = searchParams.get('weeklyUsers') || '';
    const growth = searchParams.get('growth') || '';
    const integration = searchParams.get('integration') || '';
    const language = searchParams.get('language') || '';
    const aiModel = searchParams.get('aiModel') || '';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build the base query
    let supabaseQuery = supabase
      .from('tools')
      .select('*')
      .order('weekly_users', { ascending: false });

    // Apply text search if query exists
    if (query.trim()) {
      // Use a much simpler search approach to avoid query construction issues
      supabaseQuery = supabaseQuery.ilike('name', `%${query}%`);
    }

    // Apply filters
    if (category) {
      supabaseQuery = supabaseQuery.eq('category', category);
    }

    if (pricing) {
      supabaseQuery = supabaseQuery.eq('pricing', pricing);
    }

    if (rating) {
      const minRating = parseFloat(rating);
      if (!isNaN(minRating)) {
        supabaseQuery = supabaseQuery.gte('rating', minRating);
      }
    }

    if (weeklyUsers) {
      const minUsers = parseInt(weeklyUsers);
      if (!isNaN(minUsers)) {
        supabaseQuery = supabaseQuery.gte('weekly_users', minUsers);
      }
    }

    if (growth) {
      const minGrowth = parseInt(growth);
      if (!isNaN(minGrowth)) {
        // Extract numeric value from growth string (e.g., "15%" -> 15)
        supabaseQuery = supabaseQuery.or(`growth.ilike.%${minGrowth}%`);
      }
    }

    if (integration) {
      // Check if integrations array contains the specified integration
      // Simplified to avoid complex array operations
      supabaseQuery = supabaseQuery.or(`integrations::text.ilike.%${integration}%`);
    }

    if (language) {
      // Check if features array contains language-related terms
      // Simplified to avoid complex array operations
      supabaseQuery = supabaseQuery.or(`features::text.ilike.%${language}%`);
    }

    if (aiModel) {
      // Check if features or tags contain AI model information
      // Simplified to avoid complex array operations
      supabaseQuery = supabaseQuery.or(`
        features::text.ilike.%${aiModel}%,
        tags::text.ilike.%${aiModel}%
      `);
    }

    // Apply pagination
    supabaseQuery = supabaseQuery.range(offset, offset + limit - 1);

    const { data: tools, error, count } = await supabaseQuery;

    if (error) {
      console.error('Search API error:', error);
      return NextResponse.json(
        { error: 'Failed to search tools' },
        { status: 500 }
      );
    }

    // Get total count for pagination
    let totalCount = count;
    if (totalCount === null) {
      const { count: total } = await supabase
        .from('tools')
        .select('*', { count: 'exact', head: true });
      totalCount = total || 0;
    }

    // Enhance results with relevance scoring
    const enhancedTools = tools?.map(tool => {
      let relevanceScore = 0;
      
      // Boost score for exact name matches
      if (query && tool.name.toLowerCase().includes(query.toLowerCase())) {
        relevanceScore += 10;
      }
      
      // Boost score for high ratings
      if (tool.rating >= 4.5) relevanceScore += 5;
      else if (tool.rating >= 4.0) relevanceScore += 3;
      
      // Boost score for popularity
      if (tool.weekly_users >= 1000000) relevanceScore += 4;
      else if (tool.weekly_users >= 100000) relevanceScore += 3;
      else if (tool.weekly_users >= 10000) relevanceScore += 2;
      
      return {
        ...tool,
        relevanceScore
      };
    }).sort((a, b) => b.relevanceScore - a.relevanceScore) || [];

    return NextResponse.json({
      tools: enhancedTools,
      total: totalCount,
      limit,
      offset,
      query: query.trim(),
      filters: {
        category,
        pricing,
        rating,
        weeklyUsers,
        growth,
        integration,
        language,
        aiModel
      }
    });

  } catch (error) {
    console.error('Search API error:', error);
    console.error('Search API error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      query: request.url
    });
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
