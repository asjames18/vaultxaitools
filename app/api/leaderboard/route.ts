import { NextRequest, NextResponse } from 'next/server'
import { createClientWithoutCookies } from '@/lib/supabase-server'

export async function GET(_request: NextRequest) {
  const supabase = createClientWithoutCookies()

  const { data, error } = await supabase
    .from('profiles')
    .select('user_id, points, level, display_name, avatar_url')
    .order('points', { ascending: false })
    .limit(20)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const leaderboard = (data ?? []).map((row: any, index: number) => ({
    rank: index + 1,
    display_name: row.display_name ?? 'Anonymous',
    avatar_url: row.avatar_url ?? null,
    points: row.points ?? 0,
    level: row.level ?? 'Explorer',
  }))

  return NextResponse.json({ leaderboard })
}
