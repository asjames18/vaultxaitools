import { NextRequest } from 'next/server';

async function getAdminBlogPosts() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/blog_posts?select=*`, {
      headers: {
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching admin blog posts:', error);
    return [];
  }
}

export default async function DebugAdminBlogPage() {
  const posts = await getAdminBlogPosts();
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Blog Debug Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Raw Database Posts ({posts.length})</h2>
          
          {posts.length === 0 ? (
            <p className="text-gray-600">No posts found in database</p>
          ) : (
            <div className="space-y-4">
              {posts.map((post: any) => (
                <div key={post.id} className="border rounded p-4">
                  <h3 className="font-semibold">{post.title}</h3>
                  <p className="text-sm text-gray-600">ID: {post.id}</p>
                  <p className="text-sm text-gray-600">Slug: {post.slug}</p>
                  <p className="text-sm text-gray-600">Status: {post.status}</p>
                  <p className="text-sm text-gray-600">Published: {post.published_at}</p>
                  <p className="text-sm text-gray-600">Featured: {post.featured ? 'Yes' : 'No'}</p>
                  <p className="text-sm text-gray-600">Category: {post.category}</p>
                  <p className="text-sm text-gray-600">Author: {post.author}</p>
                  <p className="text-sm text-gray-600">Content length: {post.content?.length || 0}</p>
                  <p className="text-sm text-gray-600">Created: {post.created_at}</p>
                  <p className="text-sm text-gray-600">Updated: {post.updated_at}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <p className="text-sm text-gray-600">SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET'}</p>
          <p className="text-sm text-gray-600">SUPABASE_SERVICE_ROLE_KEY: {process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET'}</p>
        </div>
      </div>
    </div>
  );
} 