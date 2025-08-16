import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // For now, return mock data since we haven't set up the database tables yet
    // In production, you would fetch from the user_profiles, user_activity, etc. tables
    
    const dashboardData = {
      user: {
        name: user.email?.split('@')[0] || 'User',
        email: user.email,
        memberSince: user.created_at,
        level: 'Explorer',
        points: 1250,
        toolsExplored: 47,
        reviewsWritten: 12,
        favoritesCount: 23
      },
      recentActivity: [
        { id: 1, action: 'Favorited ChatGPT', tool: 'ChatGPT', time: '2m ago', type: 'favorite' },
        { id: 2, action: 'Reviewed Midjourney', tool: 'Midjourney', time: '1h ago', type: 'review' },
        { id: 3, action: 'Viewed Claude', tool: 'Claude', time: '3h ago', type: 'view' },
        { id: 4, action: 'Searched for "AI writing"', tool: null, time: '5h ago', type: 'search' },
        { id: 5, action: 'Favorited GitHub Copilot', tool: 'GitHub Copilot', time: '1d ago', type: 'favorite' }
      ],
      favoriteTools: [
        { id: 1, name: 'ChatGPT', logo: '🤖', category: 'Language', rating: 4.8, lastUsed: '2m ago' },
        { id: 2, name: 'Midjourney', logo: '🎨', category: 'Design', rating: 4.6, lastUsed: '1h ago' },
        { id: 3, name: 'GitHub Copilot', logo: '💻', category: 'Development', rating: 4.7, lastUsed: '1d ago' },
        { id: 4, name: 'Claude', logo: '🧠', category: 'Language', rating: 4.5, lastUsed: '3h ago' }
      ],
      recommendations: [
        { id: 1, name: 'Notion AI', logo: '📝', category: 'Productivity', reason: 'Based on your interest in writing tools', rating: 4.4 },
        { id: 2, name: 'DALL-E 3', logo: '🎭', category: 'Design', reason: 'Similar to Midjourney', rating: 4.3 },
        { id: 3, name: 'Cursor', logo: '⌨️', category: 'Development', reason: 'Like GitHub Copilot', rating: 4.2 }
      ],
      stats: [
        { label: 'Tools Explored', value: 47, icon: '🔍', color: 'blue' },
        { label: 'Reviews Written', value: 12, icon: '✍️', color: 'green' },
        { label: 'Favorites', value: 23, icon: '❤️', color: 'red' },
        { label: 'Points Earned', value: 1250, icon: '⭐', color: 'yellow' }
      ]
    };

    return NextResponse.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'track_activity':
        // Track user activity (view, favorite, review, etc.)
        // In production, this would insert into user_activity table
        console.log('Tracking activity:', { user: user.id, action: data });
        break;
        
      case 'add_favorite':
        // Add tool to favorites
        // In production, this would insert into user_favorites table
        console.log('Adding favorite:', { user: user.id, tool: data.toolId });
        break;
        
      case 'remove_favorite':
        // Remove tool from favorites
        // In production, this would delete from user_favorites table
        console.log('Removing favorite:', { user: user.id, tool: data.toolId });
        break;
        
      case 'update_profile':
        // Update user profile
        // In production, this would update user_profiles table
        console.log('Updating profile:', { user: user.id, data });
        break;
        
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: 'Action completed successfully'
    });

  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 