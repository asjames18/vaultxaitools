"use client";

import { useState, useEffect } from 'react';
import { getToolsClient } from '@/lib/database-client';
import type { SponsoredSlot, AffiliateLink } from '@/lib/affiliate';

// Simple SVG icons as fallback
const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const PencilIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TrashIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// Define a type that matches the database structure
type DatabaseTool = {
  id: string;
  name: string;
  logo: string;
  description: string;
  long_description: string | null;
  category: string;
  rating: number;
  review_count: number;
  weekly_users: number;
  growth: string;
  website: string;
  pricing: string;
  features: string[] | null;
  created_at: string;
  updated_at: string;
};

// Sponsored Slot Form Component
function SponsoredSlotForm({ 
  slot, 
  tools, 
  onSave, 
  onCancel 
}: { 
  slot?: SponsoredSlot; 
  tools: DatabaseTool[]; 
  onSave: (slot: Omit<SponsoredSlot, 'id'>) => void; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState({
    toolId: slot?.toolId || '',
    position: slot?.position || 'top',
    startDate: slot?.startDate.toISOString().split('T')[0] || '',
    endDate: slot?.endDate.toISOString().split('T')[0] || '',
    priority: slot?.priority || 1,
    budget: slot?.budget || 100
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      toolId: formData.toolId,
      position: formData.position as 'top' | 'sidebar' | 'category' | 'search',
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      priority: formData.priority,
      budget: formData.budget,
      impressions: 0,
      clicks: 0
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {slot ? 'Edit Sponsored Slot' : 'Add Sponsored Slot'}
          </h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tool
            </label>
            <select
              value={formData.toolId}
              onChange={(e) => setFormData({ ...formData, toolId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            >
              <option value="">Select a tool</option>
              {tools.map((tool) => (
                <option key={tool.id} value={tool.id}>
                  {tool.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Position
            </label>
            <select
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value as 'search' | 'category' | 'top' | 'sidebar' })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            >
              <option value="top">Top Banner</option>
              <option value="sidebar">Sidebar</option>
              <option value="category">Category Page</option>
              <option value="search">Search Results</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Budget ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              {slot ? 'Update Slot' : 'Add Slot'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SponsoredSlots() {
  const [tools, setTools] = useState<DatabaseTool[]>([]);
  const [sponsoredSlots, setSponsoredSlots] = useState<SponsoredSlot[]>([]);
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSlot, setEditingSlot] = useState<SponsoredSlot | null>(null);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const toolsData = await getToolsClient();
        setTools(toolsData as DatabaseTool[]);
        
        // TODO: Load real sponsored slots from database
        // For now, start with empty arrays until database tables are set up
        setSponsoredSlots([]);
        setAffiliateLinks([]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAddSlot = (slot: Omit<SponsoredSlot, 'id'>) => {
    const newSlot: SponsoredSlot = {
      ...slot,
      id: Date.now().toString()
    };
    setSponsoredSlots([...sponsoredSlots, newSlot]);
    setShowAddForm(false);
  };

  const handleEditSlot = (slotData: Omit<SponsoredSlot, 'id'>) => {
    if (!editingSlot) return;
    const updatedSlot: SponsoredSlot = {
      ...slotData,
      id: editingSlot.id
    };
    setSponsoredSlots(sponsoredSlots.map(s => s.id === editingSlot.id ? updatedSlot : s));
    setEditingSlot(null);
  };

  const handleDeleteSlot = (slotId: string) => {
    setSponsoredSlots(sponsoredSlots.filter(s => s.id !== slotId));
  };

  const getToolName = (toolId: string) => {
    return tools.find(t => t.id === toolId)?.name || 'Unknown Tool';
  };

  const getPositionLabel = (position: string) => {
    const labels = {
      top: 'Top Banner',
      sidebar: 'Sidebar',
      category: 'Category Page',
      search: 'Search Results'
    };
    return labels[position as keyof typeof labels] || position;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Sponsored Slots & Affiliate Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage sponsored content placements and track affiliate performance
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Sponsored Slots</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {sponsoredSlots.filter(s => new Date() >= s.startDate && new Date() <= s.endDate).length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Impressions</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {sponsoredSlots.reduce((sum, slot) => sum + slot.impressions, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Clicks</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {sponsoredSlots.reduce((sum, slot) => sum + slot.clicks, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</h3>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(affiliateLinks.reduce((sum, link) => sum + link.revenue, 0))}
          </p>
        </div>
      </div>

      {/* Sponsored Slots */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-8">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sponsored Slots
            </h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              Add Slot
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tool
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {sponsoredSlots.map((slot) => (
                <tr key={slot.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {getToolName(slot.toolId)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {getPositionLabel(slot.position)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {slot.startDate.toLocaleDateString()} - {slot.endDate.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {slot.impressions.toLocaleString()} impressions
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {slot.clicks} clicks ({((slot.clicks / slot.impressions) * 100).toFixed(2)}% CTR)
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {formatCurrency(slot.budget)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingSlot(slot)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSlot(slot.id)}
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

      {/* Affiliate Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Affiliate Performance
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tool
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Clicks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Last Click
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {affiliateLinks.map((link) => (
                <tr key={link.toolId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {getToolName(link.toolId)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {link.clicks.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                    {formatCurrency(link.revenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {link.lastClicked.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forms */}
      {showAddForm && (
        <SponsoredSlotForm
          tools={tools}
          onSave={handleAddSlot}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {editingSlot && (
        <SponsoredSlotForm
          slot={editingSlot}
          tools={tools}
          onSave={handleEditSlot}
          onCancel={() => setEditingSlot(null)}
        />
      )}
    </div>
  );
} 