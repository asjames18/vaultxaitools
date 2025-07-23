import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Temporarily disable Supabase client to test environment variables
  console.log('Environment variables check:');
  console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET');
  console.log('SUPABASE_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');

  // If environment variables are not set, skip Supabase operations
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log('Environment variables missing, skipping Supabase operations');
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  await supabase.auth.getUser()

  // If accessing admin routes, check if user is authenticated
  if (request.nextUrl.pathname.startsWith('/admin')) {
    console.log(`[Middleware] Admin route accessed: ${request.nextUrl.pathname}`);
    
    // TEMPORARY: Bypass all admin authentication for debugging
    console.log(`[Middleware] BYPASSING ADMIN AUTHENTICATION FOR DEBUGGING`);
    
    // Skip authentication checks completely for now
    // const { data: { user } } = await supabase.auth.getUser()
    
    // // If not authenticated and not on login page, redirect to login
    // if (!user && request.nextUrl.pathname !== '/admin/login') {
    //   return NextResponse.redirect(new URL('/admin/login', request.url))
    // }
    
    // // If authenticated and on login page, redirect to admin dashboard
    // if (user && request.nextUrl.pathname === '/admin/login') {
    //   return NextResponse.redirect(new URL('/admin', request.url))
    // }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 