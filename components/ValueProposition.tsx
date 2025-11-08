'use client';

import { memo } from 'react';
import { CheckIcon } from '@/components/icons';

interface ValuePropositionProps {
  isVisible: boolean;
}

const ValueProposition = memo(({ isVisible }: ValuePropositionProps) => {
  return (
    <section className="py-20 bg-gradient-to-r from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Enhanced value proposition with animations */}
          <div className={`mb-12 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto">
              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-300 bg-gray-800/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 shadow-lg border border-gray-700/50">
                <CheckIcon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0" />
                <span className="font-medium">Ministry-focused guidance</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-300 bg-gray-800/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 shadow-lg border border-gray-700/50">
                <CheckIcon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0" />
                <span className="font-medium">Quality media resources</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-300 bg-gray-800/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 shadow-lg border border-gray-700/50 sm:col-span-2 lg:col-span-1">
                <CheckIcon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0" />
                <span className="font-medium">Expert consulting services</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

ValueProposition.displayName = 'ValueProposition';

export default ValueProposition;
