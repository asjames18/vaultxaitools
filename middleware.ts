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
  '/dashboard', // User dashboard/profile page
  '/settings', // Settings page should handle auth client-side like dashboard
  '/admin',
  '/admin/login',
  '/admin/unauthorized',
  '/admin/tools',
  '/admin/blog',
  '/admin/blog(.*)',
  '/admin/contact',
  '/admin/contact(.*)',
  '/admin/content-management',
  '/admin/content-management(.*)',
  '/admin/automation',
  '/admin/automation(.*)',
  '/admin/users',
  '/admin/users(.*)',
  '/debug-supabase', // Debug page for Supabase testing
  // REMOVED: Test pages - completely public for debugging (SECURITY RISK)
  // '/test-admin',
  // '/test-automation', 
  // '/test-(.*)', // Allow all test pages
  // '/debug-admin', // Debug admin page
];

// Define admin routes that require admin privileges
const adminRoutes = [
  // All admin routes are now public and handle their own authentication client-side
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
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  let user = null;
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error && error.message?.includes('AuthSessionMissingError')) {
      // Clear invalid session cookies
      response.cookies.delete('sb-access-token');
      response.cookies.delete('sb-refresh-token');
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

  // Allow completely public routes without auth
  if (isPublicRoute(pathname)) {
    return response;
  }

  // If no session, redirect to sign-in or admin login
  if (!user) {
    if (isAdminRoute(pathname)) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Do not enforce admin allowlist at the edge. Server pages & APIs perform role checks with RLS.

  // Protected routes that require authentication
  const protectedRoutes = [
    '/admin',
    '/admin/login',
    '/admin/unauthorized',
    '/admin/users',
    '/admin/tools',
    '/admin/categories',
    '/admin/automation',
    '/admin/refresh-content',
    // '/news', // Temporarily hidden
  ];

  // Ensure cookies are properly set in the response
  const responseWithCookies = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Copy all cookies from the request to the response
  request.cookies.getAll().forEach(cookie => {
    responseWithCookies.cookies.set(cookie.name, cookie.value, cookie);
  });

  return responseWithCookies;
}

export const config = {
  matcher: [
    '/((?!_next|api|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
}; 