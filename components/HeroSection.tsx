'use client';

import { memo } from 'react';
import Link from 'next/link';
import { SparklesIcon } from '@/components/icons';

interface HeroSectionProps {
  isVisible: boolean;
  currentHeadlineIndex: number;
  dynamicHeadlines: string[];
}

const HeroSection = memo(({ isVisible, currentHeadlineIndex, dynamicHeadlines }: HeroSectionProps) => {
  return (
    <section className="relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-green-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Enhanced badge */}
          <div className={`inline-flex items-center gap-2 bg-gradient-to-r from-green-900/20 to-green-800/20 backdrop-blur-sm border border-green-500/30 rounded-full px-6 py-3 mb-8 shadow-lg transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <SparklesIcon className="w-5 h-5 text-green-400 animate-pulse" />
            <span className="text-sm font-semibold text-green-700 dark:text-green-300">Technology Education &amp; Innovation</span>
          </div>
          
          {/* Dynamic headline */}
          <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="bg-gradient-to-r from-green-400 via-green-300 to-white bg-clip-text text-transparent">
              {dynamicHeadlines[currentHeadlineIndex]}
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className={`text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Discover the most effective AI tools, automation resources, and development guides to build real skills and create opportunities in the digital economy.
          </p>
          
          {/* Enhanced CTA with hover effects */}
          <div className={`max-w-2xl mx-auto mb-12 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex justify-center">
              <Link
                href="/AITools"
                className="group inline-flex items-center justify-center gap-2 sm:gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-xl sm:rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 text-base sm:text-lg"
              >
                <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6 group-hover:animate-spin" />
                Show Me the Tools
                <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;
