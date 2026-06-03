import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { sensitiveOperationRateLimiter } from '@/lib/rateLimit'
import { getAuthenticatedUser } from '@/lib/api-auth'

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const authHeader = request.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : '';
  const supabase = token
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { global: { headers: { Authorization: `Bearer ${token}` } } }
      )
    : await (async () => {
        const cookieStore = await cookies();
        return createServerClient(
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
      })();

  // Single joined query instead of two sequential queries
  const { data, error } = await supabase
    .from('user_favorites')
    .select('tools(id, name, logo, description, category)')
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const favorites = (data ?? [])
    .map((row: any) => row.tools)
    .filter(Boolean)
    .map((tool: any) => ({
      id: tool.id,
      name: tool.name || 'Unknown Tool',
      logo: tool.logo || '🔧',
      description: tool.description || '',
      category: tool.category || 'General',
    }))

  return NextResponse.json({ favorites })
}

export async function POST(request: Request) {
  const limit = sensitiveOperationRateLimiter(request as any);
  if (limit) return limit;

  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { toolId, action } = await request.json();
    if (!toolId || !action) {
      return NextResponse.json({ error: 'Missing toolId or action' }, { status: 400 });
    }

    if (action === 'add') {
      const { error } = await supabase
        .from('user_favorites')
        .insert({ user_id: user.id, tool_id: toolId });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ message: 'Favorite added', toolId });
    }

    if (action === 'remove') {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('tool_id', toolId);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ message: 'Favorite removed', toolId });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const limit = sensitiveOperationRateLimiter(req as never);
  if (limit) return limit;

  const user = await getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options?: any) {
          try {
            if (options) {
              cookieStore.set(name, value, options);
            } else {
              cookieStore.set(name, value);
            }
          } catch {
            // Ignore errors in route handlers
          }
        },
        remove(name: string, options?: any) {
          try {
            cookieStore.set(name, '', { maxAge: 0, ...options });
          } catch {
            // Ignore errors in route handlers
          }
        },
      },
    }
  )
  
  const { data: { user: sessionUser } } = await supabase.auth.getUser()
  
  if (!sessionUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { toolId } = await req.json()
    
    if (!toolId) {
      return NextResponse.json({ error: 'toolId required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', sessionUser.id)
      .eq('tool_id', toolId)
    
    if (error) {
      console.error('Error removing favorite:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ ok: true, action: 'deleted' })
  } catch (error) {
    console.error('Error parsing request:', error)
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
}
