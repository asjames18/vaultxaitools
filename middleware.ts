import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/AITools', // Main AI Tools directory page
  '/tool(.*)',
  '/blog(.*)',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/cookies',
  '/gdpr',
  '/documentation',
  '/status',
  '/consulting',
  '/news',
  '/sign-in',
  '/sign-up',
  '/auth/callback',
  '/reset-password',
  '/submit-tool',
  '/submit-tool/thank-you',
  '/getting-started', // Get Started page for new users
  '/search', // Search functionality
  '/debug-supabase', // Debug page for Supabase testing
  '/test-favorites', // Test page for debugging favorites functionality
  '/ui-showcase', // UI Showcase page for demonstrating components
  // REMOVED: Test pages - completely public for debugging (SECURITY RISK)
  // '/test-admin',
  // '/test-automation', 
  // '/test-(.*)', // Allow all test pages
  // '/debug-admin', // Debug admin page
];

// Define admin routes that require admin privileges
const adminRoutes: string[] = [
  '/admin(.*)'
];

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => {
    if (route.includes('(.*)')) {
      const regex = new RegExp(`^${route.replace('(.*)', '.*')}$`);
      return regex.test(pathname);
    }
    return pathname === route;
  });
}

function isAdminRoute(pathname: string): boolean {
  return adminRoutes.some(route => {
    if (route.includes('(.*)')) {
      const regex = new RegExp(`^${route.replace('(.*)', '.*')}$`);
      return regex.test(pathname);
    }
    return pathname === route;
  });
}

// Admin emails that have admin privileges - now configurable via environment
const ADMIN_EMAILS = process.env.ADMIN_EMAILS 
  ? process.env.ADMIN_EMAILS.split(',').map(email => email.trim().toLowerCase())
  : ['asjames18@gmail.com', 'asjames18@proton.me']; // Fallback for development

function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options?: Parameters<typeof response.cookies.set>[2]) {
          response.cookies.set(name, value, options);
        },
        remove(name: string, options?: Parameters<typeof response.cookies.set>[2]) {
          response.cookies.set({ name, value: '', ...options, maxAge: 0 });
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  let user: any = null;
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error && error.message?.includes('AuthSessionMissingError')) {
      // Clear invalid session cookies
      response.cookies.set('sb-access-token', '', { maxAge: 0 });
      response.cookies.set('sb-refresh-token', '', { maxAge: 0 });
      // try reading tokens from Authorization header to set session on the fly
      const authHeader = request.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.slice(7);
        const refresh = request.headers.get('x-refresh-token') || '';
        try {
          await supabase.auth.setSession({ access_token: token, refresh_token: refresh });
          const retry = await supabase.auth.getUser();
          user = retry.data.user;
        } catch {}
      }
    } else {
      user = data.user;
    }
  } catch (error) {
    // Handle any other auth errors
    console.error('Middleware auth error:', error);
  }

  const { pathname } = request.nextUrl;

  // PUBLIC ROUTES: allow without auth
  if (isPublicRoute(pathname)) {
    return response;
  }

  // ADMIN ROUTES: require admin
  if (isAdminRoute(pathname)) {
  if (!user) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    }

    let isAdmin = false;
    try {
      // Prefer DB role check; fallback to email allowlist
      const { data: roleRow } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();
      isAdmin = !!roleRow || (user.email ? isAdminEmail(user.email) : false);
    } catch {
      isAdmin = user?.email ? isAdminEmail(user.email) : false;
    }

    if (!isAdmin) {
      return NextResponse.redirect(new URL('/admin/unauthorized', request.url));
    }
    return response;
  }

  // AUTH-ONLY ROUTES: require signed-in user
  const authOnlyRoutes = [
    '/dashboard',
    '/settings',
    '/favorites',
    '/user',
  ];
  const isAuthOnly = authOnlyRoutes.some(route => {
    if (route.endsWith('(.*)')) {
      const regex = new RegExp(`^${route.replace('(.*)', '.*')}$`);
      return regex.test(pathname);
    }
    return pathname === route || pathname.startsWith(`${route}/`);
  });

  if (isAuthOnly && !user) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Default allow
  return response;
}

export const config = {
  matcher: [
    '/((?!_next|api|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
}; 