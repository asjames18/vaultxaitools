import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerSupabase } from '@/lib/supabase-server';
import { canAccessAdmin } from '@/lib/auth';

function isValidUrl(url: string): boolean {
  try { new URL(url); return true; } catch { return false; }
}

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !(await canAccessAdmin(user))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await request.json().catch(() => ({}));
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  // Load tool
  const { data: tool, error: loadErr } = await supabase.from('tools').select('*').eq('id', id).single();
  if (loadErr || !tool) return NextResponse.json({ error: 'Tool not found' }, { status: 404 });

  // Server-side validation: required fields
  const required: Array<[string, any]> = [
    ['name', tool.name],
    ['website', tool.website],
    ['category', tool.category],
    ['description', tool.description],
  ];
  const missing = required.filter(([_, v]) => !v || String(v).trim() === '').map(([k]) => k);
  if (missing.length) return NextResponse.json({ error: `Missing required fields: ${missing.join(', ')}` }, { status: 400 });
  if (!isValidUrl(tool.website)) return NextResponse.json({ error: 'website must be a valid URL' }, { status: 400 });

  // Update to published
  const { error: updErr } = await supabase.from('tools').update({ status: 'published' }).eq('id', id);
  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 400 });
  return NextResponse.json({ success: true });
}



