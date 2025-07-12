'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { blogPosts, BlogPost, categories } from '@/data/blog';

interface BlogFormData {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  readTime: string;
  featured: boolean;
  tags: string[];
}

export default function BlogManagementClient() {
  const [posts, setPosts] = useState<BlogPost[]>(blogPosts);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState<BlogFormData>({
    id: '',
    title: '',
    excerpt: '',
    content: '',
    author: '',
    category: 'Writing',
    readTime: '5 min read',
    featured: false,
    tags: []
  });

  const handleCreateNew = () => {
    setIsEditing(true);
    setEditingPost(null);
    setFormData({
      id: Date.now().toString(), // Generate temporary ID
      title: '',
      excerpt: '',
      content: '',
      author: '',
      category: 'Writing',
      readTime: '5 min read',
      featured: false,
      tags: []
    });
  };

  const handleEdit = (post: BlogPost) => {
    setIsEditing(true);
    setEditingPost(post);
    setFormData({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      category: post.category,
      readTime: post.readTime,
      featured: post.featured,
      tags: [...post.tags]
    });
  };

  const handleDelete = (postId: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      const updatedPosts = posts.filter(post => post.id !== postId);
      setPosts(updatedPosts);
      setMessage({ type: 'success', text: 'Blog post deleted successfully!' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.excerpt || !formData.content || !formData.author) {
      setMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    const newPost: BlogPost = {
      ...formData,
      date: editingPost ? editingPost.date : new Date().toISOString().split('T')[0],
      image: editingPost?.image
    };

    if (editingPost) {
      // Update existing post
      const updatedPosts = posts.map(post => 
        post.id === editingPost.id ? newPost : post
      );
      setPosts(updatedPosts);
      setMessage({ type: 'success', text: 'Blog post updated successfully!' });
    } else {
      // Create new post
      const updatedPosts = [newPost, ...posts];
      setPosts(updatedPosts);
      setMessage({ type: 'success', text: 'Blog post created successfully!' });
    }

    setIsEditing(false);
    setEditingPost(null);
    setFormData({
      id: '',
      title: '',
      excerpt: '',
      content: '',
      author: '',
      category: 'Writing',
      readTime: '5 min read',
      featured: false,
      tags: []
    });
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
      }
      e.currentTarget.value = '';
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Blog Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Create, edit, and manage blog posts
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/admin"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Admin
            </Link>
            <button
              onClick={handleCreateNew}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create New Post
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        {/* Blog Editor Form */}
        {isEditing && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter blog post title"
                  required
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Excerpt *
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter a brief excerpt"
                  rows={3}
                  required
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter the full blog post content"
                  rows={10}
                  required
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Author *
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter author name"
                  required
                />
              </div>

              {/* Category and Read Time */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    {categories.filter(cat => cat !== 'All').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, readTime: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., 5 min read"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  onKeyDown={handleTagInput}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Press Enter to add a tag"
                />
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="featured" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Mark as featured post
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingPost ? 'Update Post' : 'Create Post'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditingPost(null);
                    setFormData({
                      id: '',
                      title: '',
                      excerpt: '',
                      content: '',
                      author: '',
                      category: 'Writing',
                      readTime: '5 min read',
                      featured: false,
                      tags: []
                    });
                  }}
                  className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Blog Posts List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Blog Posts ({posts.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {post.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                          {post.excerpt}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {post.author}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(post.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {post.featured ? (
                        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full">
                          Featured
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
                          Published
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                        >
                          Edit
                        </button>
                        <Link
                          href={`/blog/${post.id}`}
                          target="_blank"
                          className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 