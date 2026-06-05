import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_details?.email;
    const productId = session.metadata?.productId;
    const productSlug = session.metadata?.productSlug;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Record order
    const { error: orderError } = await supabase.from('orders').insert({
      product_id: productId,
      customer_email: customerEmail,
      stripe_session_id: session.id,
      amount_paid: session.amount_total,
      status: 'paid',
    });

    if (orderError) {
      console.error('Failed to record order:', orderError);
      return NextResponse.json({ error: 'Failed to record order' }, { status: 500 });
    }

    // Fetch product to get file and name
    const { data: product } = await supabase
      .from('products')
      .select('name, file_url')
      .eq('id', productId)
      .single();

    // Generate signed download URL (72 hour expiry for email)
    let downloadUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id=${session.id}`;
    if (product?.file_url) {
      const { data: signed } = await supabase.storage
        .from('products')
        .createSignedUrl(product.file_url, 72 * 3600);
      if (signed?.signedUrl) downloadUrl = signed.signedUrl;
    }

    const productName = product?.name ?? 'Your product';
    const amount = ((session.amount_total ?? 0) / 100).toFixed(2);

    // Send delivery email
    if (customerEmail) {
      await resend.emails.send({
        from: 'Melanated In Tech <hello@melanatedintech.com>',
        to: customerEmail,
        subject: `Your download is ready — ${productName}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#000;color:#fff;padding:40px;">
            <h1 style="color:#22c55e;font-size:28px;margin-bottom:8px;">Your download is ready.</h1>
            <p style="color:#9ca3af;font-size:14px;margin-bottom:24px;">
              Order confirmed · $${amount} · Melanated In Tech
            </p>
            <p style="color:#d1d5db;margin-bottom:8px;">
              Thank you for purchasing <strong>${productName}</strong>.
              Your file is ready to download — the link expires in 72 hours.
            </p>
            <div style="margin:32px 0;">
              <a href="${downloadUrl}"
                 style="display:inline-block;background:#22c55e;color:#000;font-weight:bold;padding:16px 32px;border-radius:8px;text-decoration:none;font-size:16px;">
                Download ${productName}
              </a>
            </div>
            <p style="color:#6b7280;font-size:13px;margin-bottom:4px;">
              If the button doesn't work, copy this link into your browser:
            </p>
            <p style="color:#6b7280;font-size:12px;word-break:break-all;margin-bottom:32px;">
              ${downloadUrl}
            </p>
            <hr style="border:none;border-top:1px solid #1f2937;margin-bottom:24px;" />
            <p style="color:#6b7280;font-size:12px;">
              Questions? Reply to this email or visit
              <a href="https://melanatedintech.com" style="color:#22c55e;">melanatedintech.com</a>
            </p>
          </div>
        `,
      });
    }
  }

  return NextResponse.json({ received: true });
}
