import React, { memo } from 'react';
import { SparklesIcon, CheckIcon, ShieldIcon, SearchIcon, RocketIcon } from '@/components/icons';

interface HomeHeroSectionProps {
  currentHeadlineIndex: number;
  dynamicHeadlines: string[];
  isVisible: boolean;
  totalTools: number;
  testimonials: Array<{
    name: string;
    role: string;
    company: string;
    content: string;
    avatar: string;
  }>;
}

const HomeHeroSection = memo(function HomeHeroSection({
  currentHeadlineIndex,
  dynamicHeadlines,
  isVisible,
  totalTools,
  testimonials
}: HomeHeroSectionProps) {
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
          <div className={`inline-flex items-center gap-2 bg-gradient-to-r from-green-900/20 to-green-800/20 dark:from-green-900/20 dark:to-green-800/20 backdrop-blur-sm border border-green-700/40 dark:border-green-700 rounded-full px-6 py-3 mb-8 shadow-lg transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <SparklesIcon className="w-5 h-5 text-green-400" />
            <span className="text-sm font-semibold text-green-800 dark:text-green-300">
              Technology Education &amp; Innovation
            </span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>

          {/* Dynamic headline with transition */}
          <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-green-300 dark:from-green-400 dark:to-green-300 bg-clip-text text-transparent leading-tight transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {dynamicHeadlines[currentHeadlineIndex]}
          </h1>

          {/* Enhanced subtitle */}
          <p className={`text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Explore <span className="font-semibold text-green-500 dark:text-green-400">{totalTools}+ curated AI tools, resources, and tutorials</span> to help you learn technology, automate your work, and build skills that create real opportunities.
          </p>

          {/* Value propositions grid */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center gap-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <CheckIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900 dark:text-white text-sm">Learn AI & Automation</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Beginner-friendly resources</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
                <ShieldIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900 dark:text-white text-sm">Curated Tools</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Vetted AI & tech tools</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
                <RocketIcon className="w-5 h-5 text-green-500 dark:text-green-400" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900 dark:text-white text-sm">Build Real Skills</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Practical, actionable learning</div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-700 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <button className="group inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-400 hover:from-green-400 hover:to-green-300 text-black font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <SearchIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Explore AI Tools
              <div className="w-2 h-2 bg-white/30 rounded-full group-hover:bg-white/50 transition-colors"></div>
            </button>
            
            <button className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-green-400 dark:hover:text-green-400 font-medium px-6 py-4 border border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-500 rounded-xl transition-all duration-300 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              How it works
            </button>
          </div>

          {/* Trust indicators */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 text-center transition-all duration-700 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-green-400">{totalTools}+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">AI Tools</div>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-green-400">10K+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Users</div>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-green-400">100%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Free Tools</div>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">24/7</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Updated</div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer testimonials carousel */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Trusted by learners and builders worldwide
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            See what our community says about learning and growing with Melanated In Tech
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-900/40 to-green-800/40 dark:from-green-900/60 dark:to-green-800/40 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">{testimonial.company}</div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-sm">★</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default HomeHeroSection;

