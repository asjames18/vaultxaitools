'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';

interface PasswordResetFormProps {
  userId?: string;
  userEmail?: string;
  onClose: () => void;
  onSuccess: () => void;
  mode: 'admin-reset' | 'forgot-password';
}

export default function PasswordResetForm({ 
  userId, 
  userEmail, 
  onClose, 
  onSuccess, 
  mode 
}: PasswordResetFormProps) {
  const [email, setEmail] = useState(userEmail || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const supabase = createClient();

  const handleAdminReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      setMessage({ type: 'error', text: 'User ID is required' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Call secure API route for admin password reset
      const response = await fetch(`/api/admin/users/${userId}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword })
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update password');
      }
      setMessage({ 
        type: 'success', 
        text: `Password updated successfully for ${email}` 
      });
      // Clear form
      setNewPassword('');
      setConfirmPassword('');
      // Close form after 2 seconds
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to update password' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setMessage({ type: 'error', text: 'Email is required' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      setMessage({ 
        type: 'success', 
        text: `Password reset email sent to ${email}. Please check your inbox and follow the instructions.` 
      });

      // Clear form
      setEmail('');

      // Close form after 3 seconds
      setTimeout(() => {
        onSuccess();
      }, 3000);

    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to send password reset email' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = mode === 'admin-reset' ? handleAdminReset : handleForgotPassword;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {mode === 'admin-reset' ? 'Reset User Password' : 'Forgot Password'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'forgot-password' && (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="Enter your email address"
              />
            </div>
          )}

          {mode === 'admin-reset' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  User Email
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password *
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="Confirm new password"
                />
              </div>
            </>
          )}

          <div className={`p-4 rounded-lg ${
            mode === 'admin-reset' 
              ? 'bg-blue-50 dark:bg-blue-900/20' 
              : 'bg-yellow-50 dark:bg-yellow-900/20'
          }`}>
            <h4 className={`text-sm font-medium mb-2 ${
              mode === 'admin-reset' 
                ? 'text-blue-800 dark:text-blue-200' 
                : 'text-yellow-800 dark:text-yellow-200'
            }`}>
              {mode === 'admin-reset' ? '🔐 Admin Password Reset' : '📧 Password Reset Email'}
            </h4>
            <p className={`text-sm ${
              mode === 'admin-reset' 
                ? 'text-blue-700 dark:text-blue-300' 
                : 'text-yellow-700 dark:text-yellow-300'
            }`}>
              {mode === 'admin-reset' 
                ? 'The password will be updated immediately. The user can sign in with the new password right away.'
                : 'A password reset link will be sent to the email address. The user will need to click the link to set a new password.'
              }
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading 
                ? (mode === 'admin-reset' ? 'Updating...' : 'Sending...') 
                : (mode === 'admin-reset' ? 'Update Password' : 'Send Reset Email')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 