import { getAllBlogPosts } from '@/lib/blog-service';

export default async function DebugBlogPage() {
  const posts = await getAllBlogPosts();
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Blog Debug Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Database Posts ({posts.length})</h2>
          
          {posts.length === 0 ? (
            <p className="text-gray-600">No posts found in database</p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="border rounded p-4">
                  <h3 className="font-semibold">{post.title}</h3>
                  <p className="text-sm text-gray-600">ID: {post.id}</p>
                  <p className="text-sm text-gray-600">Slug: {post.slug}</p>
                  <p className="text-sm text-gray-600">Status: {post.status}</p>
                  <p className="text-sm text-gray-600">Published: {post.publishedAt}</p>
                  <p className="text-sm text-gray-600">Featured: {post.featured ? 'Yes' : 'No'}</p>
                  <p className="text-sm text-gray-600">Category: {post.category}</p>
                  <p className="text-sm text-gray-600">Author: {post.author}</p>
                  <p className="text-sm text-gray-600">Content length: {post.content?.length || 0}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <p className="text-sm text-gray-600">SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET'}</p>
          <p className="text-sm text-gray-600">SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'}</p>
          <p className="text-sm text-gray-600">SUPABASE_SERVICE_ROLE_KEY: {process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET'}</p>
        </div>
      </div>
    </div>
  );
} 