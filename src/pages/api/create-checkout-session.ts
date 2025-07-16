import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { toolName, toolUrl, description } = req.body;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: `Submit Tool: ${toolName}` },
        unit_amount: 9900,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${req.headers.origin}/submit-tool/thank-you?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.headers.origin}/submit-tool?canceled=true`,
    metadata: { toolName, toolUrl, description },
  });
  res.status(200).json({ sessionId: session.id });
} 