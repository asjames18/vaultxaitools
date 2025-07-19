import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const { id: userId } = params;
  try {
    const { role } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!role || !['admin', 'user'].includes(role)) {
      return NextResponse.json(
        { error: 'Valid role (admin or user) is required' },
        { status: 400 }
      );
    }

    // Create admin client with service role key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Update the user's role
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { role }
    });

    if (error) {
      console.error('Error updating user role:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `User role updated to ${role}`
    });

  } catch (error) {
    console.error('Server error updating user role:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
} 