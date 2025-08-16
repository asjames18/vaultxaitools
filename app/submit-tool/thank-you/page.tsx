import Link from 'next/link';

export default function ThankYou() {
  return (
    <main className="max-w-xl mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Thank You!</h1>
      <p>Your submission is received. We'll review and notify you via email.</p>
      <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
        ← Back to all tools
      </Link>
    </main>
  );
} 