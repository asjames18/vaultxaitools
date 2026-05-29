'use client';

import type { UserData } from '../../types/user-management';

export default function UserStatusBadge({ user }: { user: UserData }) {
  if (user.email_confirmed_at) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
        ✓ Confirmed
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
      ⏳ Pending
    </span>
  );
}
