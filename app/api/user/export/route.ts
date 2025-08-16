import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [{ data: favorites }, { data: reviews }] = await Promise.all([
    supabase.from('favorites').select('tool_id, created_at').eq('user_id', user.id),
    supabase.from('reviews').select('id, tool_id, rating, comment, created_at').eq('user_id', user.id)
  ]);

  return NextResponse.json({
    user: { id: user.id, email: user.email },
    favorites: favorites || [],
    reviews: reviews || []
  });
}


