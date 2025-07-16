'use client';
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function SubmitToolPage() {
  const [toolName, setToolName] = useState('');
  const [toolUrl, setToolUrl] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const query = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const canceled = query?.get('canceled');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toolName, toolUrl, description }),
    });
    const { sessionId } = await res.json();
    const stripe = await stripePromise;
    await stripe?.redirectToCheckout({ sessionId });
    setLoading(false);
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Submit Your AI Tool</h1>
      {canceled && <p className="text-red-600 mb-4">Payment canceled. Try again.</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <label>
          Tool Name<br/>
          <input
            value={toolName}
            onChange={e => setToolName(e.target.value)}
            className="w-full p-2 border"
            required
          />
        </label>
        <label>
          Tool URL<br/>
          <input
            type="url"
            value={toolUrl}
            onChange={e => setToolUrl(e.target.value)}
            className="w-full p-2 border"
            required
          />
        </label>
        <label>
          Description<br/>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full p-2 border"
            required
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-green-600 text-white rounded"
        >
          {loading ? 'Redirecting…' : 'Submit & Pay $99'}
        </button>
      </form>
    </main>
  );
} 