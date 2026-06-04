import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(request: NextRequest) {
  const sessionId = new URL(request.url).searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'session_id required' }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: order, error } = await supabase
    .from('orders')
    .select('*, products(name, file_url)')
    .eq('stripe_session_id', sessionId)
    .eq('status', 'paid')
    .single();

  if (error || !order) {
    // Webhook may not have fired yet — check Stripe directly
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status !== 'paid') {
        return NextResponse.json({ error: 'Payment not confirmed' }, { status: 402 });
      }
      return NextResponse.json({
        productName: session.metadata?.productSlug ?? 'Your product',
        fileUrl: null,
        customerEmail: session.customer_details?.email,
      });
    } catch {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
  }

  // Increment download count
  await supabase
    .from('orders')
    .update({ download_count: (order.download_count ?? 0) + 1 })
    .eq('id', order.id);

  // Generate signed URL (valid 1 hour) from Supabase Storage
  const filePath = (order.products as any)?.file_url;
  let signedUrl: string | null = null;
  if (filePath) {
    const { data: signed } = await supabase.storage
      .from('products')
      .createSignedUrl(filePath.replace('products/', ''), 3600);
    signedUrl = signed?.signedUrl ?? null;
  }

  return NextResponse.json({
    productName: (order.products as any)?.name,
    fileUrl: signedUrl,
    customerEmail: order.customer_email,
  });
}
