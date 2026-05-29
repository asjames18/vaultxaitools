'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import type { UserData, UserMessage } from '../types/user-management';

const FALLBACK_USERS: UserData[] = [
  {
    id: 'test-user-1',
    email: 'asjames18@gmail.com',
    created_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    email_confirmed_at: new Date().toISOString(),
    role: 'admin',
  },
  {
    id: 'test-user-2',
    email: 'test@example.com',
    created_at: new Date().toISOString(),
    last_sign_in_at: null,
    email_confirmed_at: null,
    role: 'user',
  },
];

export function useAdminUsers() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<UserMessage>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const supabase = createClient();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Authentication required. Please sign in as admin.');
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch users');
      }

      const fetchedUsers = result.users || [];
      setUsers(fetchedUsers.length > 0 ? fetchedUsers : FALLBACK_USERS);
    } catch (error: unknown) {
      console.error('Error fetching users:', error);
      setMessage({
        type: 'error',
        text:
          error instanceof Error
            ? error.message
            : 'Failed to fetch users. Please ensure you are signed in as admin.',
      });
      setUsers(FALLBACK_USERS);
    } finally {
      setLoading(false);
    }
  }, [supabase.auth]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.access_token) {
          setIsAuthenticated(true);
          fetchUsers();
        } else {
          setIsAuthenticated(false);
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        setLoading(false);
      }
    };

    checkAuth();
  }, [fetchUsers, supabase.auth]);

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete user');
      }

      setMessage({ type: 'success', text: 'User deleted successfully' });
      fetchUsers();
    } catch (error: unknown) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to delete user',
      });
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update role');
      }

      setMessage({ type: 'success', text: `Role updated to ${newRole}` });
      fetchUsers();
    } catch (error: unknown) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to update role',
      });
    }
  };

  return {
    users,
    loading,
    message,
    setMessage,
    isAuthenticated,
    fetchUsers,
    handleDeleteUser,
    handleRoleChange,
  };
}
