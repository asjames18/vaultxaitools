'use client';

import type { AdminMessage } from '../types';

interface AdminMessageBannerProps {
  message: AdminMessage;
}

export default function AdminMessageBanner({ message }: AdminMessageBannerProps) {
  if (!message) return null;

  return (
    <div
      className={`mb-6 p-4 rounded-lg ${
        message.type === 'success'
          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
          : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
      }`}
    >
      {message.text}
    </div>
  );
}
