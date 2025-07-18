import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/search',
  '/categories',
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
  '/admin(.*)',
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
    // First check user metadata for role
    const userRole = user.user_metadata?.role;
    
    if (userRole === 'admin') {
      return response;
    }
    
    // Check if user email is in admin list
    if (user.email && isAdminEmail(user.email)) {
      return response;
    }
    
    // Try to check database for user role (optional)
    try {
      const { data: userRoleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (userRoleData && userRoleData.role === 'admin') {
        return response;
      }
    } catch (error) {
      // If user_roles table doesn't exist, continue with email check
      console.log('user_roles table not found, using email-based admin check');
    }
    
    // Redirect to unauthorized page if not admin
    return NextResponse.redirect(new URL('/admin/unauthorized', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next|api|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
}; 