import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { adminRateLimiter } from '@/lib/rateLimit';
import { createClient } from '@/lib/supabase-server';
import { canAccessAdmin } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Admin-only: rate limit and auth check
    const rl = adminRateLimiter(request);
    if (rl) return rl;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !(await canAccessAdmin(user))) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { paths } = body;

    // Default paths to revalidate when tools change
    const defaultPaths = [
      '/',           // Home page
      '/AITools',    // All tools page
      '/categories', // Categories overview
    ];

    const pathsToRevalidate = paths || defaultPaths;

    console.log('🔄 Starting revalidation for paths:', pathsToRevalidate);

    // Revalidate each path
    for (const path of pathsToRevalidate) {
      revalidatePath(path);
      console.log(`✅ Revalidated path: ${path}`);
    }

    // Also revalidate by tag if using tag-based revalidation
    revalidateTag('tools');
    revalidateTag('homepage');
    revalidateTag('aitools');

    console.log('🎉 Revalidation completed successfully');

    return NextResponse.json({
      message: 'Revalidation successful',
      revalidated: true,
      paths: pathsToRevalidate,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Revalidation error:', error);
    return NextResponse.json(
      { message: 'Error revalidating', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET endpoint to trigger revalidation manually
export async function GET() {
  try {
    // For safety, require revalidation via POST with auth
    return NextResponse.json({ message: 'Use POST with admin auth to revalidate' }, { status: 405 });

  } catch (error) {
    console.error('❌ Manual revalidation error:', error);
    return NextResponse.json(
      { message: 'Error during manual revalidation', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
