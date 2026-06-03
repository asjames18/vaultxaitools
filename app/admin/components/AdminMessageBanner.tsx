'use client';

import type { AdminMessage } from '../types';

interface AdminMessageBannerProps {
  message: AdminMessage;
}

export default function AdminMessageBanner({ message }: AdminMessageBannerProps) {
  if (!message) return null;

  return (
    <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium border ${
      message.type === 'success'
        ? 'bg-[#4ade80]/10 border-[#4ade80]/20 text-[#4ade80]'
        : 'bg-red-500/10 border-red-500/20 text-red-400'
    }`}>
      {message.text}
    </div>
  );
}
