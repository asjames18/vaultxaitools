'use client';

import { memo } from 'react';
import DailyTool from './DailyTool';
import CommunityHighlights from './CommunityHighlights';
import type { Tool, Category } from '@/data/tools';

interface ContentSectionsProps {
  safeAllTools: Tool[];
  safeCategories: Category[];
}

const ContentSections = memo(({ safeAllTools, safeCategories }: ContentSectionsProps) => {
  return (
    <>
      {/* Daily Tool Section */}
      {safeAllTools && safeAllTools.length > 0 ? (
        <DailyTool tools={safeAllTools} />
      ) : (
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No Daily Tool Available
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              No tools data available to display the daily featured tool.
            </p>
          </div>
        </section>
      )}

      {/* Community Highlights Section */}
      {safeAllTools && safeAllTools.length > 0 ? (
        <CommunityHighlights 
          toolsCount={safeAllTools.length}
          categoriesCount={safeCategories.length}
          expertSelectedPercentage={100}
          qualityFocused={true}
        />
      ) : (
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No Community Highlights Available
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              No tools data available to display community highlights.
            </p>
          </div>
        </section>
      )}
    </>
  );
});

ContentSections.displayName = 'ContentSections';

export default ContentSections;
