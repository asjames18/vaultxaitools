import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getUserRole, createAdminClient } from '@/lib/auth';

export async function GET() {
  const supabase = await createServerSupabaseClient();

  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  console.log("Current user:", JSON.stringify(user, null, 2));

  // Use getUserRole to check admin status
  const role = getUserRole(user);
  console.log("User role:", role);

  if (role !== 'admin') {
    return NextResponse.json({ error: 'user not allowed' }, { status: 403 });
  }

  // Check if service role key is configured
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY === 'placeholder-service-key') {
    console.log('Service role key not configured, returning mock data');
    return NextResponse.json({ 
      users: [
        {
          id: user?.id || 'mock-user-id',
          email: user?.email || 'mock@example.com',
          role: 'admin',
          created_at: user?.created_at || new Date().toISOString()
        }
      ],
      message: 'Mock data - configure SUPABASE_SERVICE_ROLE_KEY for real admin functionality'
    });
  }

  try {
    // Use admin client for listing users
    const adminClient = createAdminClient();
    const { data, error } = await adminClient.auth.admin.listUsers();

    if (error) {
      console.error('Admin client error:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch users. Please check service role key configuration.' 
      }, { status: 500 });
    }

    // Return users as an array
    return NextResponse.json({ users: data?.users || [] });
  } catch (error) {
    console.error('Error in admin users route:', error);
    return NextResponse.json({ 
      error: 'Internal server error while fetching users' 
    }, { status: 500 });
  }
} 