import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getAdminEmails, isAdminEmail } from '@/lib/admin-emails';

const publicRoutes = [
  '/',
  '/AITools',
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
  '/getting-started',
  '/search',
];

const adminRoutes: string[] = ['/admin(.*)'];

const devOnlyRoutePatterns = [
  /^\/debug(?:\/|$|-)/,
  /^\/test-/,
  /^\/seed-blog(?:\/|$)/,
  /^\/ui-showcase(?:\/|$)/,
];

function isDevOnlyRoute(pathname: string): boolean {
  return devOnlyRoutePatterns.some((pattern) => pattern.test(pathname));
}

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some((route) => {
    if (route.includes('(.*)')) {
      const regex = new RegExp(`^${route.replace('(.*)', '.*')}$`);
      return regex.test(pathname);
    }
    return pathname === route;
  });
}

function isAdminRoute(pathname: string): boolean {
  return adminRoutes.some((route) => {
    if (route.includes('(.*)')) {
      const regex = new RegExp(`^${route.replace('(.*)', '.*')}$`);
      return regex.test(pathname);
    }
    return pathname === route;
  });
}

function resolveAdminEmails(): string[] {
  const emails = getAdminEmails();
  if (emails.length > 0) {
    return emails;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      '[middleware] ADMIN_EMAILS is not set. Admin email allowlist is empty in development.'
    );
  }

  return [];
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (process.env.NODE_ENV === 'production' && isDevOnlyRoute(pathname)) {
    return new NextResponse(null, { status: 404 });
  }

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

  let user: { id: string; email?: string } | null = null;
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error && error.message?.includes('AuthSessionMissingError')) {
      response.cookies.set('sb-access-token', '', { maxAge: 0 });
      response.cookies.set('sb-refresh-token', '', { maxAge: 0 });
      const authHeader = request.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.slice(7);
        const refresh = request.headers.get('x-refresh-token') || '';
        try {
          await supabase.auth.setSession({ access_token: token, refresh_token: refresh });
          const retry = await supabase.auth.getUser();
          user = retry.data.user;
        } catch {
          // ignore invalid bearer session
        }
      }
    } else {
      user = data.user;
    }
  } catch (error) {
    console.error('Middleware auth error:', error);
  }

  if (isPublicRoute(pathname)) {
    return response;
  }

  const adminEmails = resolveAdminEmails();

  if (isAdminRoute(pathname)) {
    if (!user) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    }

    let isAdmin = false;
    try {
      const { data: roleRow } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();
      isAdmin =
        !!roleRow ||
        (user.email ? adminEmails.includes(user.email.toLowerCase()) : false);
    } catch {
      isAdmin = user.email ? isAdminEmail(user.email) : false;
    }

    if (!isAdmin) {
      return NextResponse.redirect(new URL('/admin/unauthorized', request.url));
    }
    return response;
  }

  const authOnlyRoutes = ['/dashboard', '/settings', '/favorites', '/user'];
  const isAuthOnly = authOnlyRoutes.some((route) => {
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

  return response;
}

export const config = {
  matcher: [
    '/((?!_next|api|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};
