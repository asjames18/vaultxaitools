import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { getAuthenticatedUser } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();

    const { data: favorites, error: favoritesError } = await supabase
      .from('favorites')
      .select('tool_id')
      .eq('user_id', user.id);

    if (favoritesError) {
      console.log('Error fetching favorites for export:', favoritesError.message);
    }

    let reviews = null;
    const { data: reviewsById, error: reviewsByIdError } = await supabase
      .from('reviews')
      .select('id, tool_id, rating, comment, created_at')
      .eq('user_id', user.id);

    if (reviewsByIdError) {
      const userName = user.email?.split('@')[0] || user.email;
      const { data: reviewsByName, error: reviewsByNameError } = await supabase
        .from('reviews')
        .select('id, tool_id, rating, comment, created_at')
        .eq('user_name', userName);

      reviews = reviewsByName;
      if (reviewsByNameError) {
        console.log('Error fetching reviews for export:', reviewsByNameError.message);
      }
    } else {
      reviews = reviewsById;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('display_name, bio, points, level, created_at')
      .eq('user_id', user.id)
      .maybeSingle();

    if (profileError) {
      console.log('Error fetching profile for export:', profileError.message);
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
      },
      profile: profile || null,
      favorites: favorites || [],
      reviews: reviews || [],
      exported_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error exporting user data:', error);
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
  }
}
