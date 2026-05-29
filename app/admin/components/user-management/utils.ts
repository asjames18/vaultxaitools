export function formatUserDate(dateString: string | null): string {
  if (!dateString) return 'Never';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

import type { UserData, UserFilterStatus } from '../../types/user-management';

export function filterUsers(
  users: UserData[],
  searchTerm: string,
  filterStatus: UserFilterStatus
): UserData[] {
  return users.filter((user) => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'confirmed' && user.email_confirmed_at) ||
      (filterStatus === 'unconfirmed' && !user.email_confirmed_at);
    return matchesSearch && matchesStatus;
  });
}
