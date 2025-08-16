import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { getUserRole } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdminClient';

// PUT /api/admin/users/[id]/status
// Body: { disabled: boolean }
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    const { disabled } = await request.json();

    if (typeof disabled !== 'boolean') {
      return NextResponse.json(
        { error: 'disabled must be true or false' },
        { status: 400 }
      );
    }

    // Verify caller is admin via anon server client
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || (await getUserRole(user)) !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.id === userId) {
      return NextResponse.json(
        { error: 'Cannot change your own disabled status' },
        { status: 400 }
      );
    }

    // Update user using service-role key
    // @ts-ignore - 'disabled' is accepted by the API even if not in typings
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      disabled,
    } as any);

    if (error) {
      console.error('Error updating user status:', error);
      return NextResponse.json(
        { error: 'Failed to update user status' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, disabled });
  } catch (err) {
    console.error('Error in user status route:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 