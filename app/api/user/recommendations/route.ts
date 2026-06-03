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
    : await (await import('@/lib/supabase-server')).createClient()

  const { data, error } = await supabase
    .from('user_recommendations')
    .select(`
      score,
      reason,
      tools (
        id,
        name,
        logo,
        description,
        category,
        rating
      )
    `)
    .eq('user_id', user.id)
    .order('score', { ascending: false })
    .limit(10)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const recommendations = (data ?? []).map((row: any) => ({
    score: row.score,
    reason: row.reason,
    tool: row.tools,
  }))

  return NextResponse.json({ recommendations })
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

  // Get user's favorited tool IDs and their categories
  const { data: favoriteRows, error: favError } = await supabase
    .from('favorites')
    .select('tool_id')
    .eq('user_id', user.id)

  if (favError) {
    return NextResponse.json({ error: favError.message }, { status: 500 })
  }

  const favoritedToolIds = (favoriteRows ?? []).map((f: any) => f.tool_id)

  // Get the categories of favorited tools
  const favoriteCategories: string[] = []
  if (favoritedToolIds.length > 0) {
    const { data: favTools } = await supabase
      .from('tools')
      .select('category')
      .in('id', favoritedToolIds)

    for (const t of favTools ?? []) {
      if (t.category && !favoriteCategories.includes(t.category)) {
        favoriteCategories.push(t.category)
      }
    }
  }

  // Find tools in those categories that aren't already favorited
  let candidateQuery = supabase
    .from('tools')
    .select('id, name, category, rating')
    .limit(50)

  if (favoriteCategories.length > 0) {
    candidateQuery = candidateQuery.in('category', favoriteCategories)
  }

  const { data: candidates, error: candError } = await candidateQuery

  if (candError) {
    return NextResponse.json({ error: candError.message }, { status: 500 })
  }

  const favoritedSet = new Set(favoritedToolIds)
  const scored = (candidates ?? [])
    .filter((t: any) => !favoritedSet.has(t.id))
    .map((t: any) => {
      const categoryBonus = favoriteCategories.includes(t.category) ? 30 : 0
      const ratingScore = (t.rating ?? 0) * 10
      const score = Math.round(categoryBonus + ratingScore)
      return {
        user_id: user.id,
        tool_id: t.id,
        score,
        reason: favoriteCategories.includes(t.category)
          ? `Matches your interest in ${t.category}`
          : 'Highly rated tool',
      }
    })
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 10)

  // Delete old recommendations and insert fresh ones
  await supabase.from('user_recommendations').delete().eq('user_id', user.id)

  if (scored.length > 0) {
    const { error: insertError } = await supabase.from('user_recommendations').insert(scored)
    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }
  }

  return NextResponse.json({ generated: scored.length })
}
