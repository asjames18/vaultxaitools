'use client';

import {
  BarChart3Icon,
  GlobeIcon,
  NewspaperIcon,
  TrendingUpIcon,
  ZapIcon,
} from 'lucide-react';
import type { ContentTab } from '../types';

interface ContentTabNavProps {
  activeTab: ContentTab;
  onTabChange: (tab: ContentTab) => void;
}

const TABS = [
  { id: 'overview' as const, name: 'Overview', icon: BarChart3Icon },
  { id: 'news' as const, name: 'News', icon: NewspaperIcon },
  { id: 'tools' as const, name: 'Tool Updates', icon: ZapIcon },
  { id: 'announcements' as const, name: 'Announcements', icon: GlobeIcon },
  { id: 'analytics' as const, name: 'Analytics', icon: TrendingUpIcon },
];

export default function ContentTabNav({ activeTab, onTabChange }: ContentTabNavProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-8">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
