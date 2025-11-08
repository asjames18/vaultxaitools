import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerSupabase } from '@/lib/supabase-server';
import { canAccessAdmin } from '@/lib/auth';
import { adminRateLimiter, sensitiveOperationRateLimiter } from '@/lib/rateLimit';
import { logCRUD, logSensitiveOperation } from '@/lib/auditLogger';

export async function GET(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = adminRateLimiter(request);
  if (rateLimitResult) return rateLimitResult;

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !(await canAccessAdmin(user))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    const { data, error } = await supabase.from('tools').select('*').order('updated_at', { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    
    // Log read operation
    await logCRUD(user.id, user.email || '', 'READ', 'TOOL', 'BULK', {
      count: data?.length || 0,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    });
    
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching tools:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Rate limiting for sensitive operations
  const rateLimitResult = sensitiveOperationRateLimiter(request);
  if (rateLimitResult) return rateLimitResult;

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !(await canAccessAdmin(user))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    const body = await request.json();
    const { data, error } = await supabase.from('tools').insert([body]).select('id').single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    
    // Log create operation
    await logCRUD(user.id, user.email || '', 'CREATE', 'TOOL', data.id, {
      tool_name: body.name,
      category: body.category,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    });
    
    return NextResponse.json({ success: true, id: data.id });
  } catch (error) {
    console.error('Error creating tool:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  // Rate limiting for sensitive operations
  const rateLimitResult = sensitiveOperationRateLimiter(request);
  if (rateLimitResult) return rateLimitResult;

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !(await canAccessAdmin(user))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    const body = await request.json();
    const { id, ...updates } = body || {};
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    
    // Get current tool data for audit log
    const { data: currentTool } = await supabase.from('tools').select('name, category').eq('id', id).single();
    
    const { error } = await supabase.from('tools').update(updates).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    
    // Log update operation
    await logCRUD(user.id, user.email || '', 'UPDATE', 'TOOL', id, {
      tool_name: currentTool?.name || 'Unknown',
      category: currentTool?.category || 'Unknown',
      updated_fields: Object.keys(updates),
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating tool:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  // Rate limiting for sensitive operations
  const rateLimitResult = sensitiveOperationRateLimiter(request);
  if (rateLimitResult) return rateLimitResult;

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !(await canAccessAdmin(user))) return NextResponse.json({ error: 'Unauthorized' }, { status: 400 });
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    
    // Get tool data for audit log before deletion
    const { data: toolToDelete } = await supabase.from('tools').select('name, category').eq('id', id).single();
    
    const { error } = await supabase.from('tools').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    
    // Log delete operation
    await logCRUD(user.id, user.email || '', 'DELETE', 'TOOL', id, {
      tool_name: toolToDelete?.name || 'Unknown',
      category: toolToDelete?.category || 'Unknown',
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tool:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}



