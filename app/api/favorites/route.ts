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

  // First, get all favorites
  const { data: favoritesData, error: favoritesError } = await supabase
    .from('user_favorites')
    .select('tool_id')
    .eq('user_id', user.id)

  if (favoritesError) {
    return NextResponse.json({ error: favoritesError.message }, { status: 500 })
  }

  if (!favoritesData || favoritesData.length === 0) {
    return NextResponse.json({ favorites: [] })
  }

  // Get tool IDs that are valid UUIDs
  const validToolIds = favoritesData
    .map(fav => fav.tool_id)
    .filter(toolId => toolId && toolId.includes('-') && toolId.length === 36);

  if (validToolIds.length === 0) {
    return NextResponse.json({ favorites: [] })
  }

  // Fetch tool details for valid UUIDs
  const { data: toolsData, error: toolsError } = await supabase
    .from('tools')
    .select('id, name, logo, description, category')
    .in('id', validToolIds);

  if (toolsError) {
    return NextResponse.json({ error: toolsError.message }, { status: 500 })
  }

  // Transform the data to return tool objects
  const favorites = toolsData?.map(tool => ({
    id: tool.id,
    name: tool.name || 'Unknown Tool',
    logo: tool.logo || '🔧',
    description: tool.description || '',
    category: tool.category || 'General'
  })) || []
  
  return NextResponse.json({ favorites })
}

export async function POST(request: Request) {
  // Rate limit writes
  const limit = sensitiveOperationRateLimiter(request as any);
  if (limit) return limit;
  console.log('🔍 API: POST /api/favorites called');
  
  // Get authorization header
  const authHeader = request.headers.get('authorization');
  console.log('🔍 API: Auth header:', authHeader ? 'Present' : 'Missing');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ API: No valid authorization header');
    return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
  }
  
  const token = authHeader.replace('Bearer ', '');
  console.log('🔍 API: Token extracted, length:', token.length);
  
  // Create Supabase client with the token
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    }
  );
  
  console.log('🔍 API: Calling supabase.auth.getUser()...');
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError) {
    console.error('❌ API: Auth error:', authError);
    return NextResponse.json({ error: 'Auth error: ' + authError.message }, { status: 401 })
  }
  
  console.log('🔍 API: Auth result:', { hasUser: !!user, userId: user?.id, userEmail: user?.email });
  
  if (!user) {
    console.log('❌ API: No user found');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { toolId, action } = await request.json();
    console.log('🔍 API: Request body:', { toolId, action, userId: user.id });

    if (!toolId || !action) {
      return NextResponse.json({ error: 'Missing toolId or action' }, { status: 400 });
    }

    if (action === 'add') {
      console.log('🔍 API: Adding favorite...');
      const { error } = await supabase
        .from('user_favorites')
        .insert({ user_id: user.id, tool_id: toolId });

      if (error) {
        console.error('❌ API: Error adding favorite:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      console.log('✅ API: Favorite added successfully');
      return NextResponse.json({ message: 'Favorite added', toolId });
    }

    if (action === 'remove') {
      console.log('🔍 API: Removing favorite...');
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('tool_id', toolId);

      if (error) {
        console.error('❌ API: Error removing favorite:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      console.log('✅ API: Favorite removed successfully');
      return NextResponse.json({ message: 'Favorite removed', toolId });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('❌ API: Error processing request:', error);
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
