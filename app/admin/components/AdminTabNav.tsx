'use client';

import type { AdminTab } from '../types';

interface AdminTabNavProps {
  activeTab: AdminTab;
  toolsCount: number;
  categoriesCount: number;
  onTabChange: (tab: AdminTab) => void;
  onContentManagement: () => void;
}

const tabs: { id: AdminTab | 'blog' | 'investor' | 'content'; label: string; href?: string; isLink?: boolean; external?: boolean }[] = [
  { id: 'tools', label: 'Tools' },
  { id: 'categories', label: 'Categories' },
  { id: 'users', label: 'Users' },
  { id: 'contact', label: 'Contact' },
  { id: 'automation', label: 'Automation' },
  { id: 'sponsored', label: 'Sponsored' },
  { id: 'blog', label: 'Blog', href: '/admin/blog', isLink: true },
  { id: 'investor', label: 'Investor', href: '/investor', isLink: true, external: true },
  { id: 'performance', label: 'Performance' },
  { id: 'workflows', label: 'Workflows' },
  { id: 'data', label: 'Data' },
  { id: 'quality', label: 'Quality' },
  { id: 'content', label: 'Content' },
  { id: 'signup', label: 'Admin' },
];

export default function AdminTabNav({
  activeTab,
  toolsCount,
  categoriesCount,
  onTabChange,
  onContentManagement,
}: AdminTabNavProps) {
  return (
    <div className="mb-6 border-b border-[#1f1f1f] overflow-x-auto">
      <nav className="flex gap-1 min-w-max pb-0">
        {tabs.map((tab) => {
          const label =
            tab.id === 'tools' ? `Tools (${toolsCount})`
            : tab.id === 'categories' ? `Categories (${categoriesCount})`
            : tab.label;

          const isActive = activeTab === tab.id;

          if (tab.isLink && tab.href) {
            return (
              <a
                key={tab.id}
                href={tab.href}
                target={tab.external ? '_blank' : undefined}
                rel={tab.external ? 'noopener noreferrer' : undefined}
                className="px-4 py-3 text-xs font-medium whitespace-nowrap border-b-2 border-transparent text-gray-500 hover:text-gray-300 transition-colors"
              >
                {label}{tab.external ? ' ↗' : ''}
              </a>
            );
          }

          if (tab.id === 'content') {
            return (
              <button
                key={tab.id}
                onClick={onContentManagement}
                className="px-4 py-3 text-xs font-medium whitespace-nowrap border-b-2 border-transparent text-gray-500 hover:text-gray-300 transition-colors"
              >
                {label}
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as AdminTab)}
              className={`px-4 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                isActive
                  ? 'border-[#4ade80] text-[#4ade80]'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
