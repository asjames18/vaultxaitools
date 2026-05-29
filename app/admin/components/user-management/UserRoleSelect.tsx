'use client';

interface UserRoleSelectProps {
  value: string;
  onChange: (role: 'admin' | 'user') => void;
  compact?: boolean;
}

export default function UserRoleSelect({ value, onChange, compact }: UserRoleSelectProps) {
  const className = compact
    ? 'w-full px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
    : 'px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500';

  return (
    <select
      value={value || 'user'}
      onChange={(e) => onChange(e.target.value as 'admin' | 'user')}
      className={className}
    >
      <option value="user">User</option>
      <option value="admin">Admin</option>
    </select>
  );
}
