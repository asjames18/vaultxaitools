import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    let user = null;
    let supabase = null;
    
    // Try Bearer token authentication first (for client-side requests)
    const authHeader = request.headers.get('authorization');
    console.log('[user/export] Authorization header present:', Boolean(authHeader));
    let tokenFromCookie: string | null = null;
    if (!authHeader) {
      try {
        const sbCookie = request.cookies.getAll().find(c => c.name.endsWith('-auth-token') && c.name.startsWith('sb-'));
        if (sbCookie?.value) {
          const decoded = decodeURIComponent(sbCookie.value);
          const parsed = JSON.parse(decoded);
          tokenFromCookie = parsed?.access_token || null;
          console.log('[user/export] Fallback cookie token present:', Boolean(tokenFromCookie));
        }
      } catch {}
    }

    if ((authHeader && authHeader.startsWith('Bearer ')) || tokenFromCookie) {
      const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : (tokenFromCookie as string);
      
      console.log('[user/export] Using Bearer token auth');
      console.log('[user/export] Using Bearer token auth');
      
      // Create a Supabase client with the user's token
      supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          global: {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        }
      );
      
      const { data: { user: tokenUser }, error: userError } = await supabase.auth.getUser();
      if (userError || !tokenUser) {
        console.log('[user/export] Token invalid or no user from token', userError?.message);
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
      user = tokenUser;
    } else {
      // Fallback to cookie authentication (for server-side requests)
      console.log('[user/export] No Bearer token, trying cookie auth');
      supabase = await createClient();
      const { data: { user: cookieUser } } = await supabase.auth.getUser();
      if (!cookieUser) {
        console.log('[user/export] Cookie auth failed - no user');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      user = cookieUser;
    }

    // Get favorites by user_id
    const { data: favorites, error: favoritesError } = await supabase
      .from('favorites')
      .select('tool_id, created_at')
      .eq('user_id', user.id);

    if (favoritesError) {
      console.log('Error fetching favorites for export:', favoritesError.message);
    }

    // Get reviews - try user_id first, then user_name
    let reviews = null;
    const { data: reviewsById, error: reviewsByIdError } = await supabase
      .from('reviews')
      .select('id, tool_id, rating, comment, created_at')
      .eq('user_id', user.id);

    if (reviewsByIdError) {
      // Try with user_name (current table structure)
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

    // Get profile data if it exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('display_name, organization, bio, newsletter_opt_in, created_at')
      .eq('id', user.id)
      .single();

    if (profileError && !profileError.message.includes('No rows returned')) {
      console.log('Error fetching profile for export:', profileError.message);
    }

    return NextResponse.json({
      user: { 
        id: user.id, 
        email: user.email,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at
      },
      profile: profile || null,
      favorites: favorites || [],
      reviews: reviews || [],
      exported_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error exporting user data:', error);
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
  }
}


