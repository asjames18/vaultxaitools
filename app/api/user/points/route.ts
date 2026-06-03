import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getAuthenticatedUser } from '@/lib/api-auth'

const POINT_VALUES: Record<string, number> = {
  view_tool: 5,
  favorite_tool: 10,
  write_review: 20,
  complete_profile: 25,
  daily_login: 15,
}

function getLevel(points: number): string {
  if (points >= 1500) return 'Pioneer'
  if (points >= 700) return 'Innovator'
  if (points >= 300) return 'Builder'
  if (points >= 100) return 'Learner'
  return 'Explorer'
}

function getSupabaseWithToken(token: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  )
}

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const authHeader = request.headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : ''
  const supabase = token
    ? getSupabaseWithToken(token)
    : await (await import('@/lib/supabase-server')).createClient()

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('points, level')
    .eq('user_id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const points = profile?.points ?? 0
  const level = getLevel(points)

  // Get rank — count users with more points
  const { count: higherCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gt('points', points)

  const rank = (higherCount ?? 0) + 1

  return NextResponse.json({ points, level, rank })
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const authHeader = request.headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : ''
  const supabase = token
    ? getSupabaseWithToken(token)
    : await (await import('@/lib/supabase-server')).createClient()

  let body: { action?: string; tool_id?: string; tool_name?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { action, tool_id, tool_name } = body
  if (!action) {
    return NextResponse.json({ error: 'Missing action' }, { status: 400 })
  }

  const pointsToAward = POINT_VALUES[action]
  if (pointsToAward === undefined) {
    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
  }

  // Record activity
  await supabase.from('user_activity').insert({
    user_id: user.id,
    action,
    tool_id: tool_id ?? null,
    tool_name: tool_name ?? null,
    metadata: {},
  })

  // Get current points
  const { data: profile } = await supabase
    .from('profiles')
    .select('points')
    .eq('user_id', user.id)
    .single()

  const currentPoints = profile?.points ?? 0
  const newPoints = currentPoints + pointsToAward
  const newLevel = getLevel(newPoints)

  // Upsert profile points and level
  const { error: updateError } = await supabase
    .from('profiles')
    .upsert({ user_id: user.id, points: newPoints, level: newLevel }, { onConflict: 'user_id' })

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  // Trigger achievement check (fire and forget — best effort)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? `https://${request.headers.get('host')}`
  fetch(`${baseUrl}/api/user/achievements`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }).catch(() => {})

  return NextResponse.json({
    pointsAwarded: pointsToAward,
    totalPoints: newPoints,
    level: newLevel,
  })
}
