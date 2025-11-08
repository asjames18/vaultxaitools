import { Metadata } from 'next';
import Link from 'next/link';
import SettingsClient from './SettingsClient';

export const metadata: Metadata = {
  title: 'Settings - VaultX Tech',
  description: 'Manage your account settings and preferences',
};

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Settings ⚙️
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your account preferences and settings
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Account Settings</h2>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Preferences Section */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Preferences</h3>
              <SettingsClient />
            </div>

            {/* Link to Profile for account management to avoid duplication */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-md font-medium text-gray-900 dark:text-white">Manage Profile & Account</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Update name, profile details, export data, or delete account</p>
                </div>
                <Link href="/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Go to Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 