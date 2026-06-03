import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getAdminEmails } from '@/lib/admin-emails';

// Temporary debug route — remove after fixing admin access
export async function GET() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  const adminEmails = getAdminEmails();

  let roleRow = null;
  let roleError = null;
  if (user) {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();
    roleRow = data;
    roleError = error?.message ?? null;
  }

  return NextResponse.json({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    adminEmailsEnvRaw: process.env.ADMIN_EMAILS ?? '(not set)',
    adminEmailsParsed: adminEmails,
    user: user ? { id: user.id, email: user.email } : null,
    authError: authError?.message ?? null,
    userEmailInAdminList: user?.email
      ? adminEmails.includes(user.email.toLowerCase())
      : false,
    userRoleRow: roleRow,
    roleError,
    isAdmin:
      !!roleRow ||
      (user?.email ? adminEmails.includes(user.email.toLowerCase()) : false),
  });
}
