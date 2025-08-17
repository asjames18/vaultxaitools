import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function PUT(request: NextRequest) {
  try {
    let user = null;
    let supabase = null;
    
    // Try Bearer token authentication first (for client-side requests)
    const authHeader = request.headers.get('authorization');
    console.log('[user/profile] Authorization header present:', Boolean(authHeader));
    let tokenFromCookie: string | null = null;
    if (!authHeader) {
      // Some browsers (iOS Safari) may not send the Authorization header.
      // Fallback: extract Supabase access token from the cookie 'sb-*-auth-token'.
      try {
        const sbCookie = request.cookies.getAll().find(c => c.name.endsWith('-auth-token') && c.name.startsWith('sb-'));
        if (sbCookie?.value) {
          const decoded = decodeURIComponent(sbCookie.value);
          const parsed = JSON.parse(decoded);
          tokenFromCookie = parsed?.access_token || null;
          console.log('[user/profile] Fallback cookie token present:', Boolean(tokenFromCookie));
        }
      } catch {}
    }

    if ((authHeader && authHeader.startsWith('Bearer ')) || tokenFromCookie) {
      const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : (tokenFromCookie as string);
      console.log('[user/profile] Using Bearer token auth');
      
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
        console.log('[user/profile] Token invalid or no user from token', userError?.message);
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
      user = tokenUser;
    } else {
      // Fallback to cookie authentication (for server-side requests)
      console.log('[user/profile] No Bearer token, trying cookie auth');
      supabase = await createClient();
      const { data: { user: cookieUser } } = await supabase.auth.getUser();
      if (!cookieUser) {
        console.log('[user/profile] Cookie auth failed - no user');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      user = cookieUser;
    }

    const body = await request.json();
    const { display_name, organization, bio, newsletterOptIn } = body || {};

    // Build a partial update object so we don't overwrite unspecified fields
    const updates: Record<string, any> = {
      id: user.id,
      updated_at: new Date().toISOString(),
    };

    if (typeof display_name !== 'undefined') {
      updates.display_name = display_name;
    }
    if (typeof organization !== 'undefined') {
      updates.organization = organization;
    }
    if (typeof bio !== 'undefined') {
      updates.bio = bio;
    }
    if (typeof newsletterOptIn !== 'undefined') {
      updates.newsletter_opt_in = !!newsletterOptIn;
    }

    const { error } = await supabase.from('profiles').upsert(updates);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[user/profile] Profile update error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}


