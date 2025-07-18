import { getTools, getCategories } from '@/lib/database';

export default async function DebugPage() {
  try {
    const tools = await getTools();
    const categories = await getCategories();

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Database Debug</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Categories ({categories.length})</h2>
            <div className="bg-gray-100 p-4 rounded">
              <pre className="text-sm overflow-auto">
                {JSON.stringify(categories, null, 2)}
              </pre>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Tools ({tools.length})</h2>
            <div className="bg-gray-100 p-4 rounded">
              <pre className="text-sm overflow-auto">
                {JSON.stringify(tools, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Database Debug - Error</h1>
        <div className="bg-red-100 p-4 rounded">
          <pre className="text-sm text-red-800">
            {error instanceof Error ? error.message : String(error)}
          </pre>
        </div>
      </div>
    );
  }
} 