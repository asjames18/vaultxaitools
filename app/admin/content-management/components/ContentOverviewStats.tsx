'use client';

import { ClockIcon, GlobeIcon, NewspaperIcon, ZapIcon } from 'lucide-react';
import type { ContentItem, NewsItem, ToolUpdate } from '../types';

interface ContentOverviewStatsProps {
  newsItems: NewsItem[];
  toolUpdates: ToolUpdate[];
  contentItems: ContentItem[];
}

export default function ContentOverviewStats({
  newsItems,
  toolUpdates,
  contentItems,
}: ContentOverviewStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <NewspaperIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total News</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{newsItems.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <ZapIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tool Updates</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{toolUpdates.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
            <GlobeIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Published</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {contentItems.filter((item) => item.status === 'published').length}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
            <ClockIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Drafts</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {contentItems.filter((item) => item.status === 'draft').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
