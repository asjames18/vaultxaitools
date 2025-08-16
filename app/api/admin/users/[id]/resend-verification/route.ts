import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { getUserRole } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdminClient';

// POST /api/admin/users/[id]/resend-verification
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    // Verify caller is admin
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || (await getUserRole(user)) !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user's email
    // @ts-ignore typings may not include getUserById yet
    const { data: targetUser, error: fetchError } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (fetchError || !targetUser) {
      console.error('Error fetching user:', fetchError);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const email = (targetUser as any).email;

    // Send a new confirmation email
    const { error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'email_confirmation' as any,
      email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/callback`
      }
    });

    if (linkError) {
      console.error('Error resending verification email:', linkError);
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Error in resend verification route:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 