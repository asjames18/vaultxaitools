import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, source } = await request.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    // Add to Resend audience
    if (process.env.RESEND_AUDIENCE_ID) {
      await resend.contacts.create({
        email: email.toLowerCase().trim(),
        audienceId: process.env.RESEND_AUDIENCE_ID,
        unsubscribed: false,
      });
    }

    // Send welcome email
    await resend.emails.send({
      from: 'Melanated In Tech <hello@melanatedintech.com>',
      to: email,
      subject: 'Welcome to Melanated In Tech 🤝',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px;">
          <h1 style="color: #22c55e; font-size: 28px; margin-bottom: 8px;">You're in.</h1>
          <p style="color: #9ca3af; font-size: 16px; margin-bottom: 24px;">
            Welcome to Melanated In Tech — the AI tools hub built for us, by us.
          </p>
          <p style="color: #d1d5db; margin-bottom: 16px;">
            We're building the directory for AI agents, MCP servers, and resources that actually help Black creators, entrepreneurs, and builders level up with AI.
          </p>
          <p style="color: #d1d5db; margin-bottom: 32px;">
            You'll hear from us when we launch new tools, resources, and products — no spam, just signal.
          </p>
          <a href="https://melanatedintech.com/agents"
             style="display: inline-block; background: #22c55e; color: #000; font-weight: bold; padding: 14px 28px; border-radius: 8px; text-decoration: none;">
            Browse the Agent Directory →
          </a>
          <p style="color: #6b7280; font-size: 12px; margin-top: 40px;">
            Melanated In Tech · Unsubscribe at any time
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
