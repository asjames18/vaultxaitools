import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Contact API received payload:', JSON.stringify(body, null, 2));
    
    const { name, email, subject, message } = body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      console.log('Validation failed - missing fields:', { name: !!name, email: !!email, subject: !!subject, message: !!message });
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Email validation failed:', email);
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    const insertData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim()
    };
    
    console.log('Attempting to insert data:', JSON.stringify(insertData, null, 2));

    // Insert the contact message into the database
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error inserting contact message:', error);
      return NextResponse.json(
        { error: 'Failed to send message. Please try again.' },
        { status: 500 }
      );
    }

    console.log('Successfully inserted contact message:', data);
    return NextResponse.json({
      success: true,
      message: 'Message sent successfully! We\'ll get back to you soon.',
      id: data.id
    });

  } catch (error) {
    console.error('Unexpected error in contact API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 