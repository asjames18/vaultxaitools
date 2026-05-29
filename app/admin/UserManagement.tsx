'use client';

import { useState } from 'react';
import PasswordResetForm from './PasswordResetForm';
import CreateUserForm from './components/user-management/CreateUserForm';
import UserFiltersBar from './components/user-management/UserFiltersBar';
import UserMessageBanner from './components/user-management/UserMessageBanner';
import UsersList from './components/user-management/UsersList';
import { filterUsers } from './components/user-management/utils';
import { useAdminUsers } from './hooks/useAdminUsers';
import type { UserData, UserFilterStatus } from './types/user-management';

interface UserManagementProps {
  onClose?: () => void;
}

export default function UserManagement({ onClose }: UserManagementProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showPasswordResetForm, setShowPasswordResetForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<UserFilterStatus>('all');

  const {
    users,
    loading,
    message,
    setMessage,
    fetchUsers,
    handleDeleteUser,
    handleRoleChange,
  } = useAdminUsers();

  const filteredUsers = filterUsers(users, searchTerm, filterStatus);

  const handleResetPassword = (user: UserData) => {
    setSelectedUser(user);
    setShowPasswordResetForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">👥 User Management</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage user accounts and create new users
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create New User
        </button>
      </div>

      <UserMessageBanner message={message} />

      <UserFiltersBar
        searchTerm={searchTerm}
        filterStatus={filterStatus}
        onSearchChange={setSearchTerm}
        onFilterChange={setFilterStatus}
      />

      <UsersList
        users={filteredUsers}
        loading={loading}
        onRoleChange={handleRoleChange}
        onResetPassword={handleResetPassword}
        onDelete={handleDeleteUser}
      />

      {showCreateForm && (
        <CreateUserForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            setShowCreateForm(false);
            fetchUsers();
            setMessage({ type: 'success', text: 'User created successfully' });
          }}
        />
      )}

      {showPasswordResetForm && selectedUser && (
        <PasswordResetForm
          userId={selectedUser.id}
          userEmail={selectedUser.email}
          mode="admin-reset"
          onClose={() => {
            setShowPasswordResetForm(false);
            setSelectedUser(null);
          }}
          onSuccess={() => {
            setShowPasswordResetForm(false);
            setSelectedUser(null);
            setMessage({ type: 'success', text: 'Password reset successfully' });
          }}
        />
      )}
    </div>
  );
}
