import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { getAuthenticatedUser } from '@/lib/api-auth';

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const body = await request.json();
    const { display_name, organization, bio, newsletterOptIn } = body || {};

    const updates: Record<string, unknown> = {
      user_id: user.id,
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


