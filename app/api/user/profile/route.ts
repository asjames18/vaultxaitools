import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { display_name, organization, bio, newsletterOptIn } = body || {};

  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    display_name: display_name || null,
    organization: organization || null,
    bio: bio || null,
    newsletter_opt_in: !!newsletterOptIn,
    updated_at: new Date().toISOString(),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}


