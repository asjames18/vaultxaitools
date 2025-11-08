import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { publicEventRateLimiter } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  try {
    // Rate limit analytics events
    const limit = publicEventRateLimiter(request);
    if (limit) return limit;

    const supabase = await createClient();
    const body = await request.json();
    
    const { eventType, data, timestamp } = body;

    // Validate required fields
    if (!eventType || !data || !timestamp) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user information if available
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    // Prepare analytics data
    const analyticsData = {
      event_type: eventType,
      event_data: data,
      user_id: userId,
      session_id: data.sessionId,
      timestamp: new Date(timestamp).toISOString(),
      user_agent: data.userAgent || request.headers.get('user-agent'),
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      referrer: data.referrer || request.headers.get('referer'),
      page: data.page || 'unknown'
    };

    // Insert into analytics table
    const { error: insertError } = await supabase
      .from('analytics_events')
      .insert(analyticsData);

    if (insertError) {
      console.error('Error inserting analytics event:', insertError);
      
      // If table doesn't exist, create it
      if (insertError.code === '42P01') {
        await createAnalyticsTable(supabase);
        
        // Retry insert
        const { error: retryError } = await supabase
          .from('analytics_events')
          .insert(analyticsData);
          
        if (retryError) {
          console.error('Error on retry insert:', retryError);
          return NextResponse.json(
            { error: 'Failed to track analytics event' },
            { status: 500 }
          );
        }
      } else {
        return NextResponse.json(
          { error: 'Failed to track analytics event' },
          { status: 500 }
        );
      }
    }

    // Update search statistics if it's a search event
    if (eventType === 'search' && data.query) {
      await updateSearchStats(supabase, data);
    }

    // Update tool statistics if it's a tool interaction
    if (eventType === 'tool_interaction' && data.toolId) {
      await updateToolStats(supabase, data);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function createAnalyticsTable(supabase: any) {
  try {
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS analytics_events (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          event_type TEXT NOT NULL,
          event_data JSONB NOT NULL,
          user_id UUID REFERENCES auth.users(id),
          session_id TEXT,
          timestamp TIMESTAMPTZ NOT NULL,
          user_agent TEXT,
          ip_address INET,
          referrer TEXT,
          page TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
        CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON analytics_events(user_id);
        CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON analytics_events(session_id);
        CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp);
        CREATE INDEX IF NOT EXISTS idx_analytics_events_page ON analytics_events(page);

        -- Create search statistics table
        CREATE TABLE IF NOT EXISTS search_statistics (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          query TEXT NOT NULL,
          search_count INTEGER DEFAULT 1,
          total_results INTEGER DEFAULT 0,
          average_results NUMERIC DEFAULT 0,
          filters_used JSONB DEFAULT '[]',
          last_searched TIMESTAMPTZ DEFAULT NOW(),
          created_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE UNIQUE INDEX IF NOT EXISTS idx_search_statistics_query ON search_statistics(query);
        CREATE INDEX IF NOT EXISTS idx_search_statistics_count ON search_statistics(search_count DESC);
        CREATE INDEX IF NOT EXISTS idx_search_statistics_last_searched ON search_statistics(last_searched DESC);

        -- Create tool interaction statistics table
        CREATE TABLE IF NOT EXISTS tool_interaction_stats (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          tool_id TEXT NOT NULL,
          tool_name TEXT NOT NULL,
          view_count INTEGER DEFAULT 0,
          favorite_count INTEGER DEFAULT 0,
          share_count INTEGER DEFAULT 0,
          bookmark_count INTEGER DEFAULT 0,
          external_click_count INTEGER DEFAULT 0,
          last_interaction TIMESTAMPTZ DEFAULT NOW(),
          created_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE UNIQUE INDEX IF NOT EXISTS idx_tool_interaction_stats_tool_id ON tool_interaction_stats(tool_id);
        CREATE INDEX IF NOT EXISTS idx_tool_interaction_stats_views ON tool_interaction_stats(view_count DESC);
        CREATE INDEX IF NOT EXISTS idx_tool_interaction_stats_favorites ON tool_interaction_stats(favorite_count DESC);
      `
    });

    if (error) {
      console.error('Error creating analytics tables:', error);
    }
  } catch (error) {
    console.error('Error in createAnalyticsTable:', error);
  }
}

async function updateSearchStats(supabase: any, data: any) {
  try {
    const { query, results, filters } = data;
    
    // Get existing search stats
    const { data: existingStats } = await supabase
      .from('search_statistics')
      .select('*')
      .eq('query', query)
      .single();

    if (existingStats) {
      // Update existing stats
      const newCount = existingStats.search_count + 1;
      const newTotalResults = existingStats.total_results + results;
      const newAverageResults = newTotalResults / newCount;
      
      const updatedFilters = existingStats.filters_used || [];
      Object.keys(filters).forEach(filterType => {
        if (!updatedFilters.includes(filterType)) {
          updatedFilters.push(filterType);
        }
      });

      await supabase
        .from('search_statistics')
        .update({
          search_count: newCount,
          total_results: newTotalResults,
          average_results: newAverageResults,
          filters_used: updatedFilters,
          last_searched: new Date().toISOString()
        })
        .eq('query', query);
    } else {
      // Create new search stats
      await supabase
        .from('search_statistics')
        .insert({
          query,
          search_count: 1,
          total_results: results,
          average_results: results,
          filters_used: Object.keys(filters)
        });
    }
  } catch (error) {
    console.error('Error updating search stats:', error);
  }
}

async function updateToolStats(supabase: any, data: any) {
  try {
    const { toolId, toolName, action } = data;
    
    // Get existing tool stats
    const { data: existingStats } = await supabase
      .from('tool_interaction_stats')
      .select('*')
      .eq('tool_id', toolId)
      .single();

    if (existingStats) {
      // Update existing stats
      const updateData: any = {
        last_interaction: new Date().toISOString()
      };

      switch (action) {
        case 'view':
          updateData.view_count = existingStats.view_count + 1;
          break;
        case 'favorite':
          updateData.favorite_count = existingStats.favorite_count + 1;
          break;
        case 'share':
          updateData.share_count = existingStats.share_count + 1;
          break;
        case 'bookmark':
          updateData.bookmark_count = existingStats.bookmark_count + 1;
          break;
        case 'click_external':
          updateData.external_click_count = existingStats.external_click_count + 1;
          break;
      }

      await supabase
        .from('tool_interaction_stats')
        .update(updateData)
        .eq('tool_id', toolId);
    } else {
      // Create new tool stats
      const newStats: any = {
        tool_id: toolId,
        tool_name: toolName,
        last_interaction: new Date().toISOString()
      };

      switch (action) {
        case 'view':
          newStats.view_count = 1;
          break;
        case 'favorite':
          newStats.favorite_count = 1;
          break;
        case 'share':
          newStats.share_count = 1;
          break;
        case 'bookmark':
          newStats.bookmark_count = 1;
          break;
        case 'click_external':
          newStats.external_click_count = 1;
          break;
      }

      await supabase
        .from('tool_interaction_stats')
        .insert(newStats);
    }
  } catch (error) {
    console.error('Error updating tool stats:', error);
  }
}
