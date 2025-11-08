export default function UIShowcasePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          UI Showcase Test Page
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          If you can see this, the route is working!
        </p>
        <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-sm text-gray-500">
            This is a minimal test page to verify route accessibility.
          </p>
        </div>
      </div>
    </div>
  );
}
