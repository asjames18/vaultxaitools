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

  // Use admin client for listing users
  const adminClient = createAdminClient();
  const { data, error } = await adminClient.auth.admin.listUsers();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Return users as an array
  return NextResponse.json({ users: data?.users || [] });
} 