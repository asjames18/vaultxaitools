'use client';

import type { AdminTab } from '../types';

interface AdminTabNavProps {
  activeTab: AdminTab;
  toolsCount: number;
  categoriesCount: number;
  onTabChange: (tab: AdminTab) => void;
  onContentManagement: () => void;
}

const TAB_BUTTON_CLASS = (active: boolean) =>
  `py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
    active
      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
  }`;

export default function AdminTabNav({
  activeTab,
  toolsCount,
  categoriesCount,
  onTabChange,
  onContentManagement,
}: AdminTabNavProps) {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <nav className="-mb-px flex space-x-4 sm:space-x-8 min-w-max">
          <button onClick={() => onTabChange('tools')} className={TAB_BUTTON_CLASS(activeTab === 'tools')}>
            Tools ({toolsCount})
          </button>
          <button
            onClick={() => onTabChange('categories')}
            className={TAB_BUTTON_CLASS(activeTab === 'categories')}
          >
            Categories ({categoriesCount})
          </button>
          <button
            onClick={() => onTabChange('sponsored')}
            className={TAB_BUTTON_CLASS(activeTab === 'sponsored')}
          >
            💎 Sponsored
          </button>
          <button onClick={() => onTabChange('users')} className={TAB_BUTTON_CLASS(activeTab === 'users')}>
            👥 Users
          </button>
          <button
            onClick={() => onTabChange('contact')}
            className={TAB_BUTTON_CLASS(activeTab === 'contact')}
          >
            📧 Contact
          </button>
          <a
            href="/admin/blog"
            className="py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
          >
            📝 Blog
          </a>
          <a
            href="/investor"
            className="py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
          >
            📊 Investor
          </a>
          <button
            onClick={() => onTabChange('automation')}
            className={TAB_BUTTON_CLASS(activeTab === 'automation')}
          >
            🤖 Automation
          </button>
          <button
            onClick={() => onTabChange('performance')}
            className={TAB_BUTTON_CLASS(activeTab === 'performance')}
          >
            📊 Performance
          </button>
          <button onClick={() => onTabChange('search')} className={TAB_BUTTON_CLASS(activeTab === 'search')}>
            🔍 Advanced Search
          </button>
          <button
            onClick={() => onTabChange('workflows')}
            className={TAB_BUTTON_CLASS(activeTab === 'workflows')}
          >
            ⚙️ Workflows
          </button>
          <button
            onClick={() => onTabChange('accessibility')}
            className={TAB_BUTTON_CLASS(activeTab === 'accessibility')}
          >
            ♿ Accessibility
          </button>
          <button onClick={() => onTabChange('data')} className={TAB_BUTTON_CLASS(activeTab === 'data')}>
            💾 Data Management
          </button>
          <button onClick={() => onTabChange('quality')} className={TAB_BUTTON_CLASS(activeTab === 'quality')}>
            🔍 Data Quality
          </button>
          <button
            onClick={onContentManagement}
            className="py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap border-transparent text-blue-600 hover:text-blue-700 hover:border-blue-300 dark:text-blue-400 dark:hover:text-blue-300"
          >
            📰 Content
          </button>
          <button onClick={() => onTabChange('signup')} className={TAB_BUTTON_CLASS(activeTab === 'signup')}>
            👑 Admin
          </button>
        </nav>
      </div>
    </div>
  );
}
