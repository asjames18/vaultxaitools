export default function TestSimplePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          ✅ Test Page Working!
        </h1>
        <p className="text-gray-600 mb-4">
          If you can see this page, the middleware bypass is working correctly.
        </p>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Next Steps:</h2>
          <ul className="space-y-2">
            <li>• Try <a href="/test-admin" className="text-blue-600 hover:underline">/test-admin</a></li>
            <li>• Try <a href="/test-automation" className="text-blue-600 hover:underline">/test-automation</a></li>
            <li>• Both should work without authentication</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 