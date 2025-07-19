'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { 
  PlusIcon, 
  EditIcon, 
  TrashIcon, 
  EyeIcon,
  GlobeIcon,
  NewspaperIcon,
  ZapIcon,
  TrendingUpIcon,
  SettingsIcon,
  RefreshCwIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ClockIcon,
  UsersIcon,
  BarChart3Icon
} from 'lucide-react';

interface ContentItem {
  id: string;
  type: 'news' | 'tool-update' | 'announcement' | 'feature';
  title: string;
  content: string;
  status: 'draft' | 'published' | 'scheduled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  publishDate: string;
  expiryDate?: string;
  tags: string[];
  targetAudience: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  views?: number;
  engagement?: number;
}

interface ToolUpdate {
  id: string;
  toolId: string;
  toolName: string;
  updateType: 'feature' | 'bugfix' | 'improvement' | 'new';
  title: string;
  description: string;
  version?: string;
  impact: 'low' | 'medium' | 'high';
  status: 'draft' | 'published';
  publishDate: string;
  createdBy: string;
}

interface NewsItem {
  id: string;
  title: string;
  content: string;
  source: string;
  category: 'ai-news' | 'industry' | 'research' | 'product';
  status: 'draft' | 'published' | 'scheduled';
  publishDate: string;
  tags: string[];
  featured: boolean;
  createdBy: string;
}

export default function ContentManagementClient() {
  const [activeTab, setActiveTab] = useState<'overview' | 'news' | 'tools' | 'announcements' | 'analytics'>('overview');
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [toolUpdates, setToolUpdates] = useState<ToolUpdate[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'view'>('create');
  const [formData, setFormData] = useState<any>({});
  const [publishing, setPublishing] = useState(false);

  const supabase = createClient();

  // Fetch all content data
  const fetchContentData = async () => {
    try {
      setLoading(true);
      
      // Fetch content items from custom table
      const { data: content, error: contentError } = await supabase
        .from('content_management')
        .select('*')
        .order('created_at', { ascending: false });

      if (contentError) throw contentError;
      setContentItems(content || []);

      // Fetch tool updates
      const { data: tools, error: toolsError } = await supabase
        .from('tools')
        .select('*')
        .order('updated_at', { ascending: false });

      if (toolsError) throw toolsError;
      
      // Convert tools to tool updates format
      const toolUpdatesData: ToolUpdate[] = tools.map((tool, index) => ({
        id: `tool-${tool.id}`,
        toolId: tool.id,
        toolName: tool.name,
        updateType: index < 3 ? 'feature' : 'improvement',
        title: `${tool.name} - Latest Updates`,
        description: `Updated ${tool.name} with latest information and improvements`,
        version: '1.0.0',
        impact: index < 2 ? 'high' : 'medium',
        status: 'published',
        publishDate: tool.updated_at,
        createdBy: 'Admin'
      }));
      
      setToolUpdates(toolUpdatesData);

      // Fetch news items (using fallback for now)
      const fallbackNews: NewsItem[] = [
        {
          id: 'news-1',
          title: 'OpenAI Releases GPT-4 Turbo',
          content: 'OpenAI has announced the release of GPT-4 Turbo with enhanced capabilities...',
          source: 'OpenAI Blog',
          category: 'ai-news',
          status: 'published',
          publishDate: new Date().toISOString(),
          tags: ['openai', 'gpt-4', 'ai'],
          featured: true,
          createdBy: 'Admin'
        }
      ];
      
      setNewsItems(fallbackNews);

    } catch (error) {
      console.error('Error fetching content data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContentData();
  }, []);

  // Create content management table if it doesn't exist
  const setupContentTable = async () => {
    try {
      const { error } = await supabase.rpc('create_content_management_table');
      if (error) {
        console.log('Table might already exist or error:', error);
      }
    } catch (error) {
      console.error('Error setting up content table:', error);
    }
  };

  // Publish content to frontend
  const publishContent = async (item: ContentItem) => {
    try {
      setPublishing(true);
      
      // Update status to published
      const { error } = await supabase
        .from('content_management')
        .update({ 
          status: 'published',
          updated_at: new Date().toISOString()
        })
        .eq('id', item.id);

      if (error) throw error;

      // Trigger frontend refresh (you can implement webhooks or real-time subscriptions)
      await triggerFrontendRefresh(item.type);

      // Refresh data
      await fetchContentData();

      alert('Content published successfully!');
    } catch (error) {
      console.error('Error publishing content:', error);
      alert('Error publishing content');
    } finally {
      setPublishing(false);
    }
  };

  // Trigger frontend refresh
  const triggerFrontendRefresh = async (contentType: string) => {
    try {
      // You can implement webhooks, real-time subscriptions, or API calls here
      console.log(`Triggering refresh for ${contentType} content`);
      
      // Example: Send to a webhook endpoint
      await fetch('/api/admin/refresh-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: contentType })
      });
    } catch (error) {
      console.error('Error triggering refresh:', error);
    }
  };

  // Create new content
  const createContent = async (data: any) => {
    try {
      const { error } = await supabase
        .from('content_management')
        .insert([{
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (error) throw error;

      await fetchContentData();
      setShowModal(false);
      alert('Content created successfully!');
    } catch (error) {
      console.error('Error creating content:', error);
      alert('Error creating content');
    }
  };

  // Update content
  const updateContent = async (id: string, data: any) => {
    try {
      const { error } = await supabase
        .from('content_management')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      await fetchContentData();
      setShowModal(false);
      alert('Content updated successfully!');
    } catch (error) {
      console.error('Error updating content:', error);
      alert('Error updating content');
    }
  };

  // Delete content
  const deleteContent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      const { error } = await supabase
        .from('content_management')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchContentData();
      alert('Content deleted successfully!');
    } catch (error) {
      console.error('Error deleting content:', error);
      alert('Error deleting content');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading content management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Content Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage and push updates to the frontend
              </p>
            </div>
            <button
              onClick={() => {
                setModalType('create');
                setFormData({});
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              Create Content
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3Icon },
              { id: 'news', name: 'News', icon: NewspaperIcon },
              { id: 'tools', name: 'Tool Updates', icon: ZapIcon },
              { id: 'announcements', name: 'Announcements', icon: GlobeIcon },
              { id: 'analytics', name: 'Analytics', icon: TrendingUpIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Stats Cards */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <NewspaperIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total News</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{newsItems.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <ZapIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tool Updates</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{toolUpdates.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <GlobeIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Published</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {contentItems.filter(item => item.status === 'published').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                  <ClockIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Drafts</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {contentItems.filter(item => item.status === 'draft').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {activeTab === 'overview' && 'Recent Content'}
              {activeTab === 'news' && 'News Articles'}
              {activeTab === 'tools' && 'Tool Updates'}
              {activeTab === 'announcements' && 'Announcements'}
              {activeTab === 'analytics' && 'Content Analytics'}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Content
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {contentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {item.content.substring(0, 100)}...
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setModalType('view');
                            setShowModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setModalType('edit');
                            setFormData(item);
                            setShowModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          <EditIcon className="w-4 h-4" />
                        </button>
                        {item.status === 'draft' && (
                          <button
                            onClick={() => publishContent(item)}
                            disabled={publishing}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50"
                          >
                            <CheckCircleIcon className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteContent(item.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <TrashIcon className="w-4 h-4" />
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {modalType === 'create' && 'Create New Content'}
                {modalType === 'edit' && 'Edit Content'}
                {modalType === 'view' && 'View Content'}
              </h3>
              
              {modalType === 'view' && selectedItem ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedItem.title}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedItem.content}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedItem.status)}`}>
                      {selectedItem.status}
                    </span>
                  </div>
                </div>
              ) : (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (modalType === 'create') {
                    createContent(formData);
                  } else if (modalType === 'edit' && selectedItem) {
                    updateContent(selectedItem.id, formData);
                  }
                }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
                    <textarea
                      value={formData.content || ''}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows={4}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                    <select
                      value={formData.type || 'news'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="news">News</option>
                      <option value="tool-update">Tool Update</option>
                      <option value="announcement">Announcement</option>
                      <option value="feature">Feature</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
                    <select
                      value={formData.priority || 'medium'}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      {modalType === 'create' ? 'Create' : 'Update'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 