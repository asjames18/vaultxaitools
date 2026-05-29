import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { User } from '@supabase/supabase-js';

export async function getAuthenticatedUser(request: NextRequest): Promise<User | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    return user;
  }

  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    const refresh = request.headers.get('x-refresh-token') || '';
    try {
      await supabase.auth.setSession({
        access_token: token,
        refresh_token: refresh,
      });
      const retry = await supabase.auth.getUser();
      return retry.data.user;
    } catch {
      return null;
    }
  }

  return null;
}

export async function requireAuthenticatedUser(request: NextRequest): Promise<User | null> {
  return getAuthenticatedUser(request);
}
