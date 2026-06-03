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

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const authHeader = request.headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : ''
  const supabase = token
    ? getSupabaseWithToken(token)
    : (await import('@/lib/supabase-server')).createClient().then(c => c)

  const client = token
    ? getSupabaseWithToken(token)
    : await (await import('@/lib/supabase-server')).createClient()

  const { data, error } = await client
    .from('user_achievements')
    .select(`
      earned_at,
      achievements (
        slug,
        name,
        description,
        icon,
        category,
        points_reward
      )
    `)
    .eq('user_id', user.id)
    .order('earned_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ achievements: data ?? [] })
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

  // Fetch current user stats
  const [profileResult, activityResult, favoritesResult, existingAchievementsResult] =
    await Promise.all([
      supabase.from('profiles').select('points, level, streak_count').eq('user_id', user.id).single(),
      supabase.from('user_activity').select('action').eq('user_id', user.id),
      supabase.from('favorites').select('tool_id').eq('user_id', user.id),
      supabase.from('user_achievements').select('achievement_id').eq('user_id', user.id),
    ])

  const profile = profileResult.data
  const activities = activityResult.data ?? []
  const favorites = favoritesResult.data ?? []
  const existingAchievementIds = new Set(
    (existingAchievementsResult.data ?? []).map((a: any) => a.achievement_id)
  )

  const points = profile?.points ?? 0
  const streak = profile?.streak_count ?? 0
  const reviewCount = activities.filter((a: any) => a.action === 'write_review').length
  const favoriteCount = favorites.length

  // Fetch all achievements
  const { data: allAchievements, error: achError } = await supabase
    .from('achievements')
    .select('*')

  if (achError) {
    return NextResponse.json({ error: achError.message }, { status: 500 })
  }

  const newlyEarned: any[] = []

  for (const achievement of allAchievements ?? []) {
    if (existingAchievementIds.has(achievement.id)) continue

    let earned = false
    const req = achievement.requirement_value ?? 0

    switch (achievement.requirement_type) {
      case 'points':
        earned = points >= req
        break
      case 'streak':
        earned = streak >= req
        break
      case 'reviews':
        earned = reviewCount >= req
        break
      case 'favorites':
        earned = favoriteCount >= req
        break
      case 'profile_complete':
        earned = true // caller decides when profile is complete
        break
    }

    if (earned) {
      const { error: insertError } = await supabase
        .from('user_achievements')
        .insert({ user_id: user.id, achievement_id: achievement.id })

      if (!insertError) {
        newlyEarned.push(achievement)
        // Award bonus points for earning the achievement
        if (achievement.points_reward) {
          await supabase
            .from('profiles')
            .update({ points: points + achievement.points_reward })
            .eq('user_id', user.id)
        }
      }
    }
  }

  return NextResponse.json({ newlyEarned, count: newlyEarned.length })
}
