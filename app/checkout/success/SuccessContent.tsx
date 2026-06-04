'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface OrderDetails {
  productName: string;
  fileUrl: string | null;
  customerEmail: string;
}

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sessionId) {
      setError('No session found.');
      setLoading(false);
      return;
    }

    fetch(`/api/orders/by-session?session_id=${sessionId}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setOrder(data);
      })
      .catch(() => setError('Failed to load order details.'))
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Loading your order...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 py-16">
      <div className="max-w-2xl mx-auto space-y-12">

        {/* Section 1: Confirmation */}
        <div className="text-center space-y-4">
          <div className="text-6xl">✅</div>
          <h1 className="text-3xl font-bold text-white">Payment Successful</h1>
          <p className="text-gray-400">
            Thank you for supporting Melanated In Tech.
            {order?.customerEmail && ` A receipt was sent to ${order.customerEmail}.`}
          </p>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {order?.fileUrl && (
            <a
              href={order.fileUrl}
              download
              className="inline-block bg-green-500 hover:bg-green-400 text-black font-bold py-4 px-8 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Download {order.productName}
            </a>
          )}
        </div>

        {/* Section 2: Quick Start */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white">Quick Start Guide</h2>
          <p className="text-gray-400 text-sm">
            Deploy your new {order?.productName ?? 'product'} in 3 steps:
          </p>
          <ol className="space-y-3">
            {[
              'Download and extract your files',
              'Follow the included README to configure your environment',
              'Run it, test it, and share what you built',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-green-500 text-black font-bold flex items-center justify-center text-sm flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-gray-300 pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Section 3: Related Products */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Builders Also Grabbed</h2>
          <Link
            href="/products"
            className="block w-full border border-gray-700 hover:border-green-500 rounded-xl p-4 text-gray-300 hover:text-green-400 transition-colors text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
          >
            Browse the full product catalog →
          </Link>
          <Link
            href="/agents"
            className="block w-full border border-gray-700 hover:border-green-500 rounded-xl p-4 text-gray-300 hover:text-green-400 transition-colors text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
          >
            Explore the agent marketplace →
          </Link>
        </div>

        {/* Section 4: Community */}
        <div className="bg-green-950/30 border border-green-800/50 rounded-2xl p-8 text-center space-y-3">
          <h2 className="text-xl font-bold text-white">Join the Builder Community</h2>
          <p className="text-gray-400 text-sm">
            See what 500+ builders are creating with MIT resources. Share your automation, get feedback, and find collaborators.
          </p>
          <Link
            href="/contact"
            className="inline-block border border-green-500 text-green-400 hover:bg-green-500 hover:text-black font-semibold py-3 px-6 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
          >
            Get Connected →
          </Link>
        </div>

        {/* Section 5: Navigation */}
        <div className="text-center space-y-2 pt-4">
          <Link href="/products" className="block text-green-400 hover:text-green-300 transition-colors">
            Browse more products →
          </Link>
          <Link href="/agents" className="block text-gray-500 hover:text-gray-400 transition-colors text-sm">
            Explore agent marketplace
          </Link>
          <Link href="/" className="block text-gray-600 hover:text-gray-500 transition-colors text-sm">
            Return to home
          </Link>
        </div>

      </div>
    </div>
  );
}
