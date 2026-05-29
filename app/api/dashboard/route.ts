import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { getAuthenticatedUser } from '@/lib/api-auth';

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return `${Math.max(minutes, 1)}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();

    const [
      profileResult,
      favoritesResult,
      reviewsResult,
      activityResult,
    ] = await Promise.all([
      supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle(),
      supabase.from('favorites').select('tool_id, created_at').eq('user_id', user.id),
      supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase
        .from('user_activity')
        .select('id, action, tool_name, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5),
    ]);

    const profile = profileResult.data;
    const favoriteRows = favoritesResult.data ?? [];
    const favoritesCount = favoriteRows.length;
    const reviewsWritten = reviewsResult.count ?? 0;

    let favoriteTools: Array<{
      id: string;
      name: string;
      logo: string;
      category: string;
      rating: number;
      lastUsed: string;
    }> = [];

    if (favoriteRows.length > 0) {
      const toolIds = favoriteRows.map((row) => row.tool_id);
      const { data: toolsData } = await supabase
        .from('tools')
        .select('id, name, logo, category, rating')
        .in('id', toolIds);

      const favoriteDates = new Map(favoriteRows.map((row) => [row.tool_id, row.created_at]));
      favoriteTools =
        toolsData?.map((tool) => ({
          id: tool.id,
          name: tool.name,
          logo: tool.logo || '🔧',
          category: tool.category || 'General',
          rating: tool.rating ?? 0,
          lastUsed: favoriteDates.get(tool.id)
            ? formatRelativeTime(favoriteDates.get(tool.id)!)
            : 'Recently',
        })) ?? [];
    }

    const recentActivity =
      activityResult.data?.map((item) => ({
        id: item.id,
        action: item.action,
        tool: item.tool_name,
        time: item.created_at ? formatRelativeTime(item.created_at) : 'Recently',
        type: item.action,
      })) ?? [];

    const toolsExplored = recentActivity.filter((item) => item.type === 'view').length;

    const dashboardData = {
      user: {
        name: profile?.display_name || user.email?.split('@')[0] || 'User',
        email: user.email,
        memberSince: user.created_at,
        level: profile?.level || 'Explorer',
        points: profile?.points ?? 0,
        toolsExplored,
        reviewsWritten,
        favoritesCount,
      },
      recentActivity,
      favoriteTools,
      recommendations: [],
      stats: [
        { label: 'Tools Explored', value: toolsExplored, icon: '🔍', color: 'blue' },
        { label: 'Reviews Written', value: reviewsWritten, icon: '✍️', color: 'green' },
        { label: 'Favorites', value: favoritesCount, icon: '❤️', color: 'red' },
        { label: 'Points Earned', value: profile?.points ?? 0, icon: '⭐', color: 'yellow' },
      ],
    };

    return NextResponse.json({ success: true, data: dashboardData });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'track_activity':
        await supabase.from('user_activity').insert({
          user_id: user.id,
          action: data?.type || 'view',
          tool_id: data?.toolId ?? null,
          tool_name: data?.toolName ?? null,
          metadata: data ?? {},
        });
        break;

      case 'update_profile':
        await supabase.from('profiles').upsert({
          user_id: user.id,
          display_name: data?.displayName,
          bio: data?.bio,
          updated_at: new Date().toISOString(),
        });
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Action completed successfully' });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
