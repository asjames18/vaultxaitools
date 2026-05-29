'use client';

import { createClient } from '@/lib/supabase';
import type { UserMessage } from '../../types/user-management';

interface UserMessageBannerProps {
  message: UserMessage;
}

export default function UserMessageBanner({ message }: UserMessageBannerProps) {
  if (!message) return null;

  const showLogoutCta =
    message.type === 'success' && message.text?.toLowerCase().includes('role updated');

  return (
    <div
      className={`p-4 rounded-lg ${
        message.type === 'success'
          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
          : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
      }`}
    >
      {message.text}
      {showLogoutCta && (
        <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Please log out and log back in for changes to take effect.
          </span>
          <button
            onClick={async () => {
              const supabase = createClient();
              await supabase.auth.signOut();
              window.location.href = '/';
            }}
            className="inline-flex items-center px-3 py-1.5 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Log out now
          </button>
        </div>
      )}
    </div>
  );
}
