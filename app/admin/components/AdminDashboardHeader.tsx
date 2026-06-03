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

export default function AdminDashboardHeader({ user, sessionInfo, onLogout }: AdminDashboardHeaderProps) {
  const minutesLeft = Math.floor((sessionInfo?.timeRemaining ?? 0) / 60000);

  return (
    <div className="bg-[#111] border-b border-[#1f1f1f] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-[#4ade80] rounded-full" />
          <span className="text-[#4ade80] font-bold text-sm tracking-widest uppercase hidden sm:block">
            Melanated In Tech
          </span>
          <span className="text-[#333] text-sm hidden sm:block">/</span>
          <span className="text-white font-semibold text-sm">Admin</span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {sessionInfo && !sessionInfo.isExpired && (
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#4ade80] rounded-full" />
              <span className="text-gray-500 text-xs">{minutesLeft}m left</span>
            </div>
          )}
          {sessionInfo?.isExpired && (
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
              <span className="text-red-400 text-xs">Session expired</span>
            </div>
          )}
          <span className="text-gray-500 text-xs hidden md:block truncate max-w-[180px]">{user.email}</span>
          <button
            onClick={onLogout}
            className="px-3 py-1.5 text-xs font-medium text-gray-400 border border-[#2a2a2a] rounded-lg hover:border-red-500/50 hover:text-red-400 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
