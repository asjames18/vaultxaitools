import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET() {
  const supabase = await createServerSupabaseClient();

  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  console.log("Current user:", user);

  // Defensive: check for user_metadata and role
  const role = user?.user_metadata?.role;
  console.log("User role:", role);

  if (typeof role !== 'string' || role.trim().toLowerCase() !== 'admin') {
    return NextResponse.json({ error: 'user not allowed' }, { status: 403 });
  }

  // Fetch all users from Supabase
  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Return users as an array
  return NextResponse.json({ users: data?.users || [] });
} 