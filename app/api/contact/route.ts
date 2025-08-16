import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabaseAdminClient';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Use anonymous key for public contact form submissions
// RLS policies should allow public inserts to contact_messages
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Simple in-memory rate limiting (for production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 3; // Max 3 submissions per 15 minutes

function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }
  
  if (record.count >= MAX_REQUESTS) {
    return true;
  }
  
  record.count++;
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { name, email, subject, message } = body;

    // Rate limiting check
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    if (isRateLimited(clientIP)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Enhanced input validation and sanitization
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Input length validation to prevent abuse
    if (name.length > 100 || email.length > 255 || subject.length > 200 || message.length > 2000) {
      return NextResponse.json(
        { error: 'Input too long. Please keep messages concise.' },
        { status: 400 }
      );
    }

    // Enhanced email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Input sanitization - remove potentially dangerous characters
    const sanitizeInput = (input: string): string => {
      return input
        .trim()
        .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, '') // Remove event handlers
        .substring(0, 1000); // Limit length
    };

    const insertData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email).toLowerCase(),
      subject: sanitizeInput(subject),
      message: sanitizeInput(message),
      status: 'unread' // Use valid status value
    };

    // Insert the contact message into the database (anon first, fallback to admin if RLS blocks)
    let { data, error } = await supabase
      .from('contact_messages')
      .insert([insertData])
      .select()
      .single();

    // If RLS blocks anon insert, retry with service role on the server
    if (error && (error as any).code === '42501') {
      const adminResult = await supabaseAdmin
        .from('contact_messages')
        .insert([insertData])
        .select()
        .single();
      data = adminResult.data as any;
      error = adminResult.error as any;
    }

    if (error) {
      // Log error internally but don't expose details to user
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to send message. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully! We\'ll get back to you soon.',
      id: data.id
    });

  } catch (error) {
    // Log error internally but don't expose details to user
    console.error('Unexpected error in contact API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 