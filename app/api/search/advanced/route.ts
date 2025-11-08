import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, filters, page = 1, limit = 20 } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    // Build the search query
    let searchQuery = supabase
      .from('tools')
      .select(`
        id,
        name,
        description,
        category,
        tags,
        rating,
        review_count,
        weekly_users,
        price_model,
        features,
        website,
        logo,
        created_at,
        updated_at
      `);

    // Apply text search using PostgreSQL full-text search
    if (query.trim()) {
      searchQuery = searchQuery.or(`
        name.ilike.%${query}%,
        description.ilike.%${query}%,
        category.ilike.%${query}%,
        tags.cs.{${query}}
      `);
    }

    // Apply filters
    if (filters) {
      // Category filter
      if (filters.category && filters.category.length > 0) {
        searchQuery = searchQuery.in('category', filters.category);
      }

      // Rating filter
      if (filters.rating && filters.rating > 0) {
        searchQuery = searchQuery.gte('rating', filters.rating);
      }

      // Popularity filter (using weekly_users as proxy)
      if (filters.popularity && filters.popularity > 0) {
        searchQuery = searchQuery.gte('weekly_users', filters.popularity);
      }

      // Price filter
      if (filters.price && filters.price !== 'all') {
        searchQuery = searchQuery.eq('price_model', filters.price);
      }

      // Date range filter
      if (filters.dateRange && filters.dateRange !== 'all') {
        const now = new Date();
        let startDate: Date;
        
        switch (filters.dateRange) {
          case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case 'year':
            startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
          default:
            startDate = new Date(0);
        }
        
        searchQuery = searchQuery.gte('updated_at', startDate.toISOString());
      }

      // Features filter
      if (filters.features && filters.features.length > 0) {
        searchQuery = searchQuery.overlaps('features', filters.features);
      }
    }

    // Add pagination
    const offset = (page - 1) * limit;
    searchQuery = searchQuery.range(offset, offset + limit - 1);

    // Execute search
    const { data: tools, error, count } = await searchQuery;

    if (error) {
      console.error('Search error:', error);
      return NextResponse.json(
        { error: 'Search failed' },
        { status: 500 }
      );
    }

    // Calculate relevance scores and enhance results
    const enhancedResults = tools?.map(tool => {
      // Calculate relevance score based on query match
      let relevanceScore = 0;
      const queryLower = query.toLowerCase();
      
      // Name match (highest weight)
      if (tool.name.toLowerCase().includes(queryLower)) {
        relevanceScore += 0.4;
      }
      
      // Description match
      if (tool.description?.toLowerCase().includes(queryLower)) {
        relevanceScore += 0.3;
      }
      
      // Category match
      if (tool.category?.toLowerCase().includes(queryLower)) {
        relevanceScore += 0.2;
      }
      
      // Tags match
      if (tool.tags?.some((tag: string) => tag.toLowerCase().includes(queryLower))) {
        relevanceScore += 0.1;
      }

      // Popularity boost
      const popularityBoost = Math.min((tool.weekly_users || 0) / 10000, 0.2);
      relevanceScore += popularityBoost;

      // Rating boost
      const ratingBoost = Math.min((tool.rating || 0) / 5, 0.1);
      relevanceScore += ratingBoost;

      return {
        ...tool,
        relevance: Math.min(relevanceScore, 1.0),
        type: 'tool' as const,
        views: tool.weekly_users || 0,
        likes: Math.floor((tool.rating || 0) * 100),
        price: tool.price_model || 'unknown',
        userRating: tool.rating || 0,
        reviewCount: tool.review_count || 0,
        lastUpdated: tool.updated_at || tool.created_at
      };
    }) || [];

    // Sort by relevance score
    enhancedResults.sort((a, b) => b.relevance - a.relevance);

    // Get total count for pagination
    let totalCount = count;
    if (!totalCount) {
      const { count: total } = await supabase
        .from('tools')
        .select('*', { count: 'exact', head: true });
      totalCount = total || 0;
    }

    return NextResponse.json({
      results: enhancedResults,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      },
      filters: filters || {},
      query
    });

  } catch (error) {
    console.error('Advanced search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const rating = searchParams.get('rating');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // Simple search for GET requests
    let searchQuery = supabase
      .from('tools')
      .select(`
        id,
        name,
        description,
        category,
        rating,
        weekly_users
      `)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(limit);

    if (category) {
      searchQuery = searchQuery.eq('category', category);
    }

    if (rating) {
      searchQuery = searchQuery.gte('rating', parseFloat(rating));
    }

    const { data: tools, error } = await searchQuery;

    if (error) {
      console.error('Simple search error:', error);
      return NextResponse.json(
        { error: 'Search failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      results: tools || [],
      query,
      total: tools?.length || 0
    });

  } catch (error) {
    console.error('Simple search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
