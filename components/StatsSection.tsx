'use client';

import { memo } from 'react';
import type { Tool, Category } from '@/data/tools';

interface StatsSectionProps {
  isVisible: boolean;
  safeAllTools: Tool[];
  safeCategories: Category[];
}

const StatsSection = memo(({ isVisible, safeAllTools, safeCategories }: StatsSectionProps) => {
  if (!safeAllTools || safeAllTools.length === 0) return null;

  return (
    <div className={`grid grid-cols-2 gap-6 sm:gap-8 max-w-2xl sm:max-w-3xl mx-auto transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="text-center group">
        <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform">
          {safeAllTools.length}
        </div>
        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Media Tools</div>
        <div className="text-xs text-green-600 mt-1">Ministry Focused</div>
      </div>
      <div className="text-center group">
        <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform">
          {safeCategories.length}
        </div>
        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Categories</div>
      </div>
    </div>
  );
});

StatsSection.displayName = 'StatsSection';

export default StatsSection;
