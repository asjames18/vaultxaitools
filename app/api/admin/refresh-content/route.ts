import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const { type, contentId } = await request.json();
    
    // Verify admin authentication
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: userRole, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleError || userRole?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Log the refresh request
    console.log(`Content refresh triggered for type: ${type}, contentId: ${contentId}`);

    // Revalidate relevant pages
    revalidatePath('/');
    revalidatePath('/categories');
    // revalidatePath('/news'); // Temporarily hidden
    revalidatePath('/blog');

    // Update content cache timestamp to trigger frontend refresh
    const { error: cacheError } = await supabase
      .from('content_cache')
      .upsert({
        content_type: type,
        last_updated: new Date().toISOString(),
        updated_by: user.id
      });

    if (cacheError) {
      console.error('Error updating cache timestamp:', cacheError);
    }

    // Trigger real-time subscription update
    await supabase
      .channel('content-updates')
      .send({
        type: 'broadcast',
        event: 'content-refresh',
        payload: {
          type,
          contentId,
          timestamp: new Date().toISOString(),
          updatedBy: user.id
        }
      });

    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: `Content refresh triggered for ${type}`,
      timestamp: new Date().toISOString(),
      revalidated: true
    });

  } catch (error) {
    console.error('Error in refresh-content API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = createClient();
    
    // Get cache status for all content types
    const { data: cacheData, error } = await supabase
      .from('content_cache')
      .select('*')
      .order('last_updated', { ascending: false });

    if (error) {
      console.error('Error fetching cache data:', error);
      return NextResponse.json({ cacheData: [] });
    }

    return NextResponse.json({ 
      cacheData: cacheData || [],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in refresh-content GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 