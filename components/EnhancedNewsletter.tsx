'use client';

import { useState } from 'react';
import EmailSignupForm from './EmailSignupForm';

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const ShieldIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const benefits = [
  "Hand-picked AI tools tested by our experts",
  "Weekly deep-dive reviews of the best tools",
  "Exclusive access to beta tools and early releases",
  "Detailed comparison guides and use cases",
  "Community insights from power users"
];

interface CurationStat { number: string; label: string }

function getCurationStats(curatedCount?: number): CurationStat[] {
  return [
    { number: '100+', label: 'Tools Tested' },
    { number: curatedCount != null ? String(curatedCount) : '—', label: 'Curated Tools' }
  ];
}

export default function EnhancedNewsletter() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  return (
    <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 xl:gap-16 items-start">
          {/* Content - Now takes 2 columns on desktop for better spacing */}
          <div className="text-white xl:col-span-2">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
              <SparklesIcon className="w-5 h-5" />
              <span className="text-sm font-semibold">Expert-Curated AI Tools</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl xl:text-6xl font-bold mb-8 leading-tight">
              Only the Best AI Tools Make the Cut
            </h2>
            
            <p className="text-xl md:text-2xl text-indigo-100 mb-10 leading-relaxed max-w-3xl">
              We test hundreds of AI tools so you don't have to. Get weekly recommendations of only the most effective, reliable, and innovative AI solutions that actually deliver results.
            </p>

            {/* Curation Process - Better organized with more spacing */}
            <div className="mb-10">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
                <ShieldIcon className="w-6 h-6 text-green-400" />
                Our Curation Process:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <CheckIcon className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-indigo-100 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Curation Stats - Larger and more prominent */}
            <div className="flex gap-12">
              {getCurationStats((typeof window !== 'undefined' && (window as any).__vaultxToolCount) || undefined).map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-lg text-indigo-100 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Signup Form - Now takes 1 column on desktop */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 xl:col-span-1">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                Join the Curated AI Community
              </h3>
              <p className="text-indigo-100">
                Get the best AI tools delivered to your inbox every week.
              </p>
            </div>

            {!isSubscribed ? (
              <div className="space-y-4">
                <EmailSignupForm />
                <p className="text-xs text-indigo-100 text-center">
                  🔒 We respect your privacy. Unsubscribe at any time.
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Welcome to the Curated Community!
                </h3>
                <p className="text-indigo-100">
                  Check your email for your first curated AI tool recommendation.
                </p>
              </div>
            )}

            {/* Trust indicators */}
            <div className="mt-6 pt-6 border-t border-white/20">
              <div className="flex items-center justify-center gap-6 text-xs text-indigo-100">
                <span>✓ Expert Tested</span>
                <span>✓ Quality Guaranteed</span>
                <span>✓ No Spam</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 