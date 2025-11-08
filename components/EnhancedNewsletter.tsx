'use client';

import React, { useState } from 'react';
import { SparklesIcon, ShieldIcon, CheckIcon } from 'lucide-react';
import EmailSignupForm from './EmailSignupForm';

interface EnhancedNewsletterProps {
  toolsCount?: number;
  categoriesCount?: number;
  subscriberCount?: number;
}

const benefits = [
  "Rigorous testing and evaluation",
  "Real user feedback and reviews",
  "Performance benchmarking",
  "Security and privacy assessment",
  "Cost-benefit analysis",
  "Integration compatibility check"
];

interface CurationStat { number: string; label: string }

function getCurationStats(toolsCount?: number, categoriesCount?: number): CurationStat[] {
  return [
    { number: toolsCount && toolsCount > 0 ? `${toolsCount}+` : '100+', label: 'Tools Tested' },
    { number: toolsCount && toolsCount > 0 ? String(toolsCount) : '—', label: 'Curated Tools' },
    { number: categoriesCount && categoriesCount > 0 ? String(categoriesCount) : '—', label: 'Categories' }
  ];
}

export default function EnhancedNewsletter({ toolsCount, categoriesCount, subscriberCount = 10000 }: EnhancedNewsletterProps) {
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
              <span className="text-sm font-semibold">Expert-Curated Media Tools</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl xl:text-6xl font-bold mb-8 leading-tight">
              Only the Best Media Tools Make the Cut
            </h2>
            
            <p className="text-xl md:text-2xl text-indigo-100 mb-10 leading-relaxed max-w-3xl">
              We test hundreds of media production tools so you don't have to. Get weekly recommendations of only the most effective, reliable, and innovative media solutions for your church or ministry.
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
              {getCurationStats(toolsCount, categoriesCount).map((stat, index) => (
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
                Join the Curated Media Community
              </h3>
              <p className="text-indigo-100">
                Get the best media tools and resources delivered to your inbox every week.
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
                  Check your email for your first curated media tool recommendation.
                </p>
              </div>
            )}

            {/* Trust indicators */}
            <div className="mt-6 pt-6 border-t border-white/20">
              <div className="flex items-center justify-center gap-4 text-xs text-indigo-100">
                <span>✓ {subscriberCount.toLocaleString()}+ subscribers</span>
                <span>✓ Weekly curated picks</span>
                <span>✓ No spam, ever</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 