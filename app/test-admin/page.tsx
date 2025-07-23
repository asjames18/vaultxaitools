import UserManagement from '../admin/UserManagement';

export default function TestAdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            🛠️ Test Admin Portal
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Direct access to admin features for debugging
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <UserManagement />
        </div>
      </div>
    </div>
  );
} 