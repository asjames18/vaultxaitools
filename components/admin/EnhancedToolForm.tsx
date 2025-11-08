'use client';

import React, { useState, useEffect } from 'react';
import { Save, AlertTriangle, CheckCircle, XCircle, Info, RefreshCw } from 'lucide-react';
import { validateToolData, generateRealisticDataSuggestions, isMockData } from '@/lib/toolValidation';

interface Tool {
  id?: string;
  name: string;
  logo: string;
  description: string;
  longDescription?: string;
  category: string;
  rating: number;
  reviewCount: number;
  weeklyUsers: number;
  growth: string;
  website: string;
  pricing: string;
  features?: string[];
  pros?: string[];
  cons?: string[];
  alternatives?: { id?: string; name: string; rating: number; logo: string }[];
  tags?: string[];
}

interface EnhancedToolFormProps {
  tool?: Tool;
  categories: string[];
  onSubmit: (tool: Tool) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function EnhancedToolForm({ 
  tool, 
  categories, 
  onSubmit, 
  onCancel, 
  loading = false 
}: EnhancedToolFormProps) {
  const [formData, setFormData] = useState<Tool>({
    name: '',
    logo: '🤖',
    description: '',
    longDescription: '',
    category: '',
    rating: 4.0,
    reviewCount: 100,
    weeklyUsers: 5000,
    growth: '+25%',
    website: '',
    pricing: 'Freemium',
    features: [],
    pros: [],
    cons: [],
    alternatives: [],
    tags: []
  });

  const [validation, setValidation] = useState<any>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<any>({});
  const [isMockDataDetected, setIsMockDataDetected] = useState(false);

  useEffect(() => {
    if (tool) {
      setFormData(tool);
    }
  }, [tool]);

  useEffect(() => {
    // Validate form data whenever it changes
    const result = validateToolData(formData);
    setValidation(result);
    
    // Check for mock data patterns
    setIsMockDataDetected(isMockData(formData));
    
    // Generate suggestions if there are issues
    if (!result.isValid || result.warnings.length > 0) {
      const dataSuggestions = generateRealisticDataSuggestions(formData);
      setSuggestions(dataSuggestions);
    }
  }, [formData]);

  const handleInputChange = (field: keyof Tool, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: keyof Tool, index: number, value: string) => {
    setFormData(prev => {
      const currentValue = prev[field];
      const isArray = Array.isArray(currentValue);
      return {
        ...prev,
        [field]: isArray ? [...(currentValue as string[]), value] : [value]
      };
    });
  };

  const handleArrayRemove = (field: keyof Tool, index: number) => {
    setFormData(prev => {
      const currentValue = prev[field];
      const isArray = Array.isArray(currentValue);
      return {
        ...prev,
        [field]: isArray ? (currentValue as any[]).filter((_, i) => i !== index) : []
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validation?.isValid) {
      onSubmit(formData);
    }
  };

  const applySuggestion = (field: keyof Tool, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getValidationIcon = () => {
    if (!validation) return <Info className="w-5 h-5 text-gray-400" />;
    if (validation.errors.length > 0) return <XCircle className="w-5 h-5 text-red-500" />;
    if (validation.warnings.length > 0) return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  };

  const getValidationColor = () => {
    if (!validation) return 'border-gray-200';
    if (validation.errors.length > 0) return 'border-red-200 bg-red-50';
    if (validation.warnings.length > 0) return 'border-yellow-200 bg-yellow-50';
    return 'border-green-200 bg-green-50';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Validation Status */}
        <div className={`p-4 rounded-lg border-2 ${getValidationColor()}`}>
          <div className="flex items-center gap-3">
            {getValidationIcon()}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Data Quality Status
              </h3>
              {validation && (
                <div className="mt-2 space-y-2">
                  {validation.errors.length > 0 && (
                    <div className="text-red-700 dark:text-red-300">
                      <strong>Errors ({validation.errors.length}):</strong>
                      <ul className="list-disc list-inside ml-4 mt-1">
                        {validation.errors.map((error: string, index: number) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {validation.warnings.length > 0 && (
                    <div className="text-yellow-700 dark:text-yellow-300">
                      <strong>Warnings ({validation.warnings.length}):</strong>
                      <ul className="list-disc list-inside ml-4 mt-1">
                        {validation.warnings.map((warning: string, index: number) => (
                          <li key={index}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {validation.suggestions.length > 0 && (
                    <div className="text-blue-700 dark:text-blue-300">
                      <strong>Suggestions:</strong>
                      <ul className="list-disc list-inside ml-4 mt-1">
                        {validation.suggestions.map((suggestion: string, index: number) => (
                          <li key={index}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Mock Data Warning */}
          {isMockDataDetected && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                <AlertTriangle className="w-4 h-4" />
                <strong>Mock Data Detected!</strong>
              </div>
              <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                This tool contains data patterns that look like placeholder/mock data. 
                Consider using more realistic values.
              </p>
            </div>
          )}
        </div>

        {/* Basic Information */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tool Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="e.g., ChatGPT, Midjourney"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Logo/Emoji
              </label>
              <input
                type="text"
                value={formData.logo}
                onChange={(e) => handleInputChange('logo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="🤖"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Website *
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="https://example.com"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Brief description of the tool..."
            />
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Long Description
            </label>
            <textarea
              value={formData.longDescription}
              onChange={(e) => handleInputChange('longDescription', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Detailed description of the tool..."
            />
          </div>
        </div>

        {/* Statistics with Validation */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Statistics & Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rating *
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => handleInputChange('rating', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="4.2"
              />
              {suggestions.rating && (
                <button
                  type="button"
                  onClick={() => applySuggestion('rating', suggestions.rating)}
                  className="mt-1 text-xs text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                >
                  💡 Use suggestion: {suggestions.rating}
                </button>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Review Count *
              </label>
              <input
                type="number"
                min="1"
                value={formData.reviewCount}
                onChange={(e) => handleInputChange('reviewCount', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="150"
              />
              {suggestions.reviewCount && (
                <button
                  type="button"
                  onClick={() => applySuggestion('reviewCount', suggestions.reviewCount)}
                  className="mt-1 text-xs text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                >
                  💡 Use suggestion: {suggestions.reviewCount.toLocaleString()}
                </button>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Weekly Users *
              </label>
              <input
                type="number"
                min="100"
                value={formData.weeklyUsers}
                onChange={(e) => handleInputChange('weeklyUsers', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="5000"
              />
              {suggestions.weeklyUsers && (
                <button
                  type="button"
                  onClick={() => applySuggestion('weeklyUsers', suggestions.weeklyUsers)}
                  className="mt-1 text-xs text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                >
                  💡 Use suggestion: {suggestions.weeklyUsers.toLocaleString()}
                </button>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Growth *
              </label>
              <input
                type="text"
                value={formData.growth}
                onChange={(e) => handleInputChange('growth', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="+25%"
              />
              {suggestions.growth && (
                <button
                  type="button"
                  onClick={() => applySuggestion('growth', suggestions.growth)}
                  className="mt-1 text-xs text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                >
                  💡 Use suggestion: {suggestions.growth}
                </button>
              )}
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pricing
            </label>
            <select
              value={formData.pricing}
              onChange={(e) => handleInputChange('pricing', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="Free">Free</option>
              <option value="Freemium">Freemium</option>
              <option value="Paid">Paid</option>
              <option value="Enterprise">Enterprise</option>
            </select>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Features & Details</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Features
              </label>
              <div className="space-y-2">
                {formData.features?.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => {
                        const newFeatures = [...(formData.features || [])];
                        newFeatures[index] = e.target.value;
                        handleInputChange('features', newFeatures);
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Feature description"
                    />
                    <button
                      type="button"
                      onClick={() => handleArrayRemove('features', index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleArrayChange('features', formData.features?.length || 0, '')}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                >
                  + Add Feature
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pros
                </label>
                <div className="space-y-2">
                  {formData.pros?.map((pro, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={pro}
                        onChange={(e) => {
                          const newPros = [...(formData.pros || [])];
                          newPros[index] = e.target.value;
                          handleInputChange('pros', newPros);
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Pro point"
                      />
                      <button
                        type="button"
                        onClick={() => handleArrayRemove('pros', index)}
                        className="px-3 py-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleArrayChange('pros', formData.pros?.length || 0, '')}
                    className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 text-sm"
                  >
                    + Add Pro
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cons
                </label>
                <div className="space-y-2">
                  {formData.cons?.map((con, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={con}
                        onChange={(e) => {
                          const newCons = [...(formData.cons || [])];
                          newCons[index] = e.target.value;
                          handleInputChange('cons', newCons);
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Con point"
                      />
                      <button
                        type="button"
                        onClick={() => handleArrayRemove('cons', index)}
                        className="px-3 py-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleArrayChange('cons', formData.cons?.length || 0, '')}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm"
                  >
                    + Add Con
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!validation?.isValid || loading}
            className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              validation?.isValid && !loading
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {tool ? 'Update Tool' : 'Create Tool'}
          </button>
        </div>
      </form>
    </div>
  );
}
