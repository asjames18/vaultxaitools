import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/search',
  '/categories',
  '/categories(.*)', // Add this to allow access to individual category pages
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
  '/trending',
  '/news',
  '/sign-in',
  '/sign-up',
  '/auth/callback',
  '/reset-password',
  '/submit-tool',
  '/submit-tool/thank-you',
  '/admin/login',
  '/admin/unauthorized',
];

// Define admin routes that require admin privileges
const adminRoutes = [
  '/admin',
  '/admin/automation',
  '/admin/automation(.*)',
  '/admin/blog(.*)',
  '/admin/contact(.*)',
  '/admin/content-management(.*)',
  '/admin/users(.*)',
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

// Admin emails that have admin privileges
const ADMIN_EMAILS = [
  'asjames18@gmail.com',
  'asjames18@proton.me',
];

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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return response;
  }

  // Check if user is authenticated
  if (!user) {
    // Redirect to appropriate login page based on route
    if (isAdminRoute(pathname)) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    } else {
      const signInUrl = new URL('/sign-in', request.url);
      signInUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Check admin routes
  if (isAdminRoute(pathname)) {
    console.log(`[Middleware] Admin route accessed: ${pathname}`);
    console.log(`[Middleware] User:`, user ? { id: user.id, email: user.email } : null);
    
        // TEMPORARY FIX: Completely bypass admin authentication for debugging
    console.log(`[Middleware] BYPASSING ALL ADMIN AUTHENTICATION FOR DEBUGGING`);
    return response;
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next|api|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
}; 