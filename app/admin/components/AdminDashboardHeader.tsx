'use client';

import { User } from '@supabase/supabase-js';

interface SessionInfo {
  isExpired?: boolean;
  timeRemaining?: number;
}

interface AdminDashboardHeaderProps {
  user: User;
  sessionInfo: SessionInfo | null;
  onLogout: () => void;
}

export default function AdminDashboardHeader({
  user,
  sessionInfo,
  onLogout,
}: AdminDashboardHeaderProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Welcome back, {user.email}
            </p>
            {sessionInfo && (
              <div className="flex items-center space-x-2 mt-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    sessionInfo.isExpired ? 'bg-red-500' : 'bg-green-500'
                  }`}
                />
                <span className="text-xs text-gray-500">
                  Session expires in {Math.floor((sessionInfo.timeRemaining ?? 0) / 60000)} minutes
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base min-h-[44px]"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
