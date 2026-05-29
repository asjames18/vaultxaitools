'use client';

import type { UserFilterStatus } from '../../types/user-management';

interface UserFiltersBarProps {
  searchTerm: string;
  filterStatus: UserFilterStatus;
  onSearchChange: (value: string) => void;
  onFilterChange: (status: UserFilterStatus) => void;
}

export default function UserFiltersBar({
  searchTerm,
  filterStatus,
  onSearchChange,
  onFilterChange,
}: UserFiltersBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search users by email..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
      </div>
      <div>
        <select
          value={filterStatus}
          onChange={(e) => onFilterChange(e.target.value as UserFilterStatus)}
          className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        >
          <option value="all">All Users</option>
          <option value="confirmed">Confirmed Only</option>
          <option value="unconfirmed">Pending Only</option>
        </select>
      </div>
    </div>
  );
}
