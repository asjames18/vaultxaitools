import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getAuthenticatedUser } from '@/lib/api-auth'

function getSupabaseWithToken(token: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  )
}

function toDateString(date: Date): string {
  return date.toISOString().split('T')[0]
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
    .select('streak_count, last_active_date')
    .eq('user_id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    streak_count: profile?.streak_count ?? 0,
    last_active_date: profile?.last_active_date ?? null,
  })
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

  const today = toDateString(new Date())

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('streak_count, last_active_date')
    .eq('user_id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const lastActive = profile?.last_active_date ?? null
  const currentStreak = profile?.streak_count ?? 0

  // Already logged in today — no change
  if (lastActive === today) {
    return NextResponse.json({
      streak_count: currentStreak,
      last_active_date: lastActive,
      updated: false,
    })
  }

  let newStreak: number
  if (lastActive) {
    const yesterday = toDateString(new Date(Date.now() - 86_400_000))
    newStreak = lastActive === yesterday ? currentStreak + 1 : 1
  } else {
    newStreak = 1
  }

  const { error: upsertError } = await supabase
    .from('profiles')
    .upsert(
      { user_id: user.id, streak_count: newStreak, last_active_date: today },
      { onConflict: 'user_id' }
    )

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 })
  }

  return NextResponse.json({
    streak_count: newStreak,
    last_active_date: today,
    updated: true,
  })
}
