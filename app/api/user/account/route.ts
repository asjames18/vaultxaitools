import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function DELETE() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Soft-delete: anonymize profile and sign out. For hard delete, use admin RPC.
  await supabase.from('profiles').update({ display_name: 'Deleted User', bio: null, organization: null }).eq('id', user.id);
  await supabase.auth.signOut();
  return NextResponse.json({ ok: true });
}


