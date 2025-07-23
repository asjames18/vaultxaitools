'use client';

import { useState } from 'react';

export default function DebugAdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Ready to test admin functions');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      if (response.ok) {
        setUsers(data.users || []);
        setMessage(`✅ Found ${data.users?.length || 0} users`);
      } else {
        setMessage(`❌ API Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Network Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const grantAdmin = async (userId: string, email: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'admin' }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(`✅ Admin role granted to ${email}`);
        fetchUsers(); // Refresh list
      } else {
        setMessage(`❌ Failed to grant admin: ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">🔧 Debug Admin Panel</h1>
          <p className="text-gray-600 mb-4">Direct access to admin functions</p>
          
          <div className="flex gap-4 mb-4">
            <button
              onClick={fetchUsers}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Fetch Users'}
            </button>
          </div>

          <div className="bg-gray-50 p-4 rounded mb-4">
            <pre className="text-sm">{message}</pre>
          </div>
        </div>

        {users.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Users ({users.length})</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Role</th>
                    <th className="text-left p-2">Created</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="p-2">{user.email}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          user.role === 'admin' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="p-2 text-sm text-gray-600">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-2">
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => grantAdmin(user.id, user.email)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                          >
                            Make Admin
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 