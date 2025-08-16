import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerSupabase } from '@/lib/supabase-server';
import { canAccessAdmin } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !(await canAccessAdmin(user))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { url } = await request.json();
    if (!url) return NextResponse.json({ error: 'Missing url' }, { status: 400 });

    const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 VaultXBot' } });
    const html = await res.text();

    // Very simple OG/meta extraction
    const get = (re: RegExp) => (html.match(re)?.[1] || '').trim();
    const ogTitle = get(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["'][^>]*>/i) || get(/<title>([^<]+)<\/title>/i);
    const ogDesc = get(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["'][^>]*>/i) || get(/<meta\s+name=["']description["']\s+content=["']([^"']+)["'][^>]*>/i);
    const ogImage = get(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["'][^>]*>/i);
    const favicon = get(/<link\s+rel=["']icon["']\s+href=["']([^"']+)["'][^>]*>/i) || get(/<link\s+rel=["']shortcut icon["']\s+href=["']([^"']+)["'][^>]*>/i);

    const suggestion = {
      name: ogTitle || url.replace(/^https?:\/\//, '').split('/')[0],
      website: url,
      description: ogDesc || '',
      og_image_url: ogImage || '',
      favicon_url: favicon || '',
    };

    return NextResponse.json(suggestion);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to enrich' }, { status: 500 });
  }
}



