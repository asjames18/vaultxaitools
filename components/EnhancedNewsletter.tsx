 'use client';

import { useState } from 'react';
import EmailSignupForm from './EmailSignupForm';

const GiftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const benefits = [
  "Weekly curated AI tool recommendations",
  "Exclusive early access to new tools",
  "AI productivity tips and tutorials",
  "Special discounts and deals",
  "Community insights and trends"
];

const socialProof = [
  { number: "15,000+", label: "Subscribers" },
  { number: "4.9/5", label: "Rating" },
  { number: "98%", label: "Open Rate" }
];

export default function EnhancedNewsletter() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  return (
    <section className="py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <GiftIcon className="w-5 h-5" />
              <span className="text-sm font-semibold">Free Weekly Newsletter</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Stay Ahead of the AI Revolution
            </h2>
            
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Get the latest AI tools, tips, and insights delivered to your inbox every week. Join thousands of professionals who are already using AI to boost their productivity.
            </p>

            {/* Benefits */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">What you'll get:</h3>
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckIcon className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-blue-100">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Proof */}
            <div className="flex gap-8">
              {socialProof.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-sm text-blue-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Signup Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                Join the AI Revolution
              </h3>
              <p className="text-blue-100">
                Get started in 30 seconds. No spam, unsubscribe anytime.
              </p>
            </div>

            {!isSubscribed ? (
              <div className="space-y-4">
                <EmailSignupForm />
                <p className="text-xs text-blue-200 text-center">
                  🔒 We respect your privacy. Unsubscribe at any time.
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Welcome to the Community!
                </h3>
                <p className="text-blue-100">
                  Check your email for your first AI tool recommendation.
                </p>
              </div>
            )}

            {/* Trust indicators */}
            <div className="mt-6 pt-6 border-t border-white/20">
              <div className="flex items-center justify-center gap-6 text-xs text-blue-200">
                <span>✓ GDPR Compliant</span>
                <span>✓ No Spam</span>
                <span>✓ Instant Unsubscribe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 