import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== 'string' || !email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }
    const supabase = createClient();
    // Check for existing email
    const { data: existing } = await supabase.from('signups').select('id').eq('email', email).single();
    if (existing) {
      return NextResponse.json({ error: 'Email already signed up.' }, { status: 409 });
    }
    // Insert new signup
    const { error } = await supabase.from('signups').insert({ email });
    if (error) {
      return NextResponse.json({ error: 'Failed to save email.' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
} 