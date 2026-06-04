'use client';

import { useState } from 'react';

interface Props {
  productSlug: string;
  productName: string;
}

export default function BuyButton({ productSlug, productName }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleBuy() {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productSlug }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.');
        return;
      }

      window.location.href = data.url;
    } catch {
      setError('Failed to start checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleBuy}
        disabled={loading}
        aria-label={loading ? 'Redirecting to Stripe checkout' : `Buy ${productName}`}
        className="w-full bg-green-500 hover:bg-green-400 disabled:bg-green-900 disabled:cursor-not-allowed text-black font-bold py-4 px-6 rounded-xl text-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        {loading ? 'Redirecting to checkout…' : `Buy ${productName}`}
      </button>
      {error && <p className="mt-3 text-red-400 text-sm">{error}</p>}
    </div>
  );
}
