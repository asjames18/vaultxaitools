'use client';
import { useState } from 'react';

export default function EmailCapture({ source = 'homepage' }: { source?: string }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });
      if (res.ok) setStatus('success');
      else setStatus('error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-4">
        <p className="text-green-400 font-semibold text-lg">You're in. Check your inbox.</p>
        <p className="text-gray-500 text-sm mt-1">Welcome to Melanated In Tech.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <label htmlFor="email-capture-input" className="sr-only">Email address</label>
      <input
        id="email-capture-input"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Enter your email address"
        required
        aria-describedby="email-capture-hint"
        className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
      />
      <span id="email-capture-hint" className="sr-only">We'll send you weekly agent blueprints. Unsubscribe anytime.</span>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="px-6 py-3 bg-green-500 hover:bg-green-400 disabled:bg-green-900 text-black font-bold rounded-lg transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        {status === 'loading' ? 'Joining...' : 'Get Agent Blueprints'}
      </button>
      {status === 'error' && <p className="text-red-400 text-sm w-full">Something went wrong. Try again.</p>}
    </form>
  );
}
