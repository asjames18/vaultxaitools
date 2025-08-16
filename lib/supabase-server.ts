import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    }
  );
}

// Client that doesn't require cookies - for static generation and server-side operations
export function createClientWithoutCookies() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {
          // No-op for static generation
        },
      },
    }
  );
}

// Alternative client that handles cookies more explicitly
export async function createClientWithCookies() {
  const cookieStore = await cookies();
  
  // Get all cookies and convert to the format Supabase expects
  const allCookies = cookieStore.getAll();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return allCookies;
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignore errors in server components
          }
        },
      },
    }
  );
}

// Enhanced client that tries multiple approaches to get cookies
export async function createEnhancedClient() {
  const cookieStore = await cookies();
  
  // Get all cookies
  const allCookies = cookieStore.getAll();
  
  // Check for Supabase-specific cookies
  const supabaseCookies = allCookies.filter(cookie => 
    cookie.name.includes('supabase') || 
    cookie.name.includes('auth') ||
    cookie.name.includes('session')
  );
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return allCookies;
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignore errors in server components
          }
        },
      },
    }
  );
} 