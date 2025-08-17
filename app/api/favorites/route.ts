import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 });
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    // Create Supabase client with the token
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    // Verify the user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { toolId, action } = await request.json();
    
    if (!toolId || !action) {
      return NextResponse.json({ error: 'Missing toolId or action' }, { status: 400 });
    }

    if (action === 'add') {
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, tool_id: toolId });
      
      if (error) {
        console.error('Error adding favorite:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      
      return NextResponse.json({ success: true, action: 'added' });
    } else if (action === 'remove') {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('tool_id', toolId);
      
      if (error) {
        console.error('Error removing favorite:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      
      return NextResponse.json({ success: true, action: 'removed' });
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Favorites API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 });
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    // Create Supabase client with the token
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    // Verify the user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { data: favorites, error } = await supabase
      .from('favorites')
      .select('tool_id')
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error fetching favorites:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ 
      favorites: favorites.map(fav => fav.tool_id) 
    });
  } catch (error) {
    console.error('Favorites GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
