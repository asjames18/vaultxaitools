'use client';

import { useState, useEffect } from 'react';
import { Settings, Palette, Eye, Font, Layout, Zap, Save, Reset, Download, Upload } from 'lucide-react';

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  layout: 'compact' | 'comfortable' | 'spacious';
  animations: 'minimal' | 'moderate' | 'extensive';
  colorScheme: 'default' | 'blue' | 'green' | 'purple' | 'orange';
  contrast: 'normal' | 'high' | 'low';
  reducedMotion: boolean;
  showTooltips: boolean;
  autoSave: boolean;
}

interface PersonalizationProps {
  className?: string;
  onPreferencesChange?: (prefs: UserPreferences) => void;
}

export default function Personalization({ className = '', onPreferencesChange }: PersonalizationProps) {
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'system',
    fontSize: 'medium',
    layout: 'comfortable',
    animations: 'moderate',
    colorScheme: 'default',
    contrast: 'normal',
    reducedMotion: false,
    showTooltips: true,
    autoSave: true
  });

  const [activeTab, setActiveTab] = useState<'appearance' | 'accessibility' | 'behavior' | 'advanced'>('appearance');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    // Load saved preferences
    const savedPrefs = localStorage.getItem('vaultx-preferences');
    if (savedPrefs) {
      try {
        const parsedPrefs = JSON.parse(savedPrefs);
        setPreferences(prev => ({ ...prev, ...parsedPrefs }));
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Save preferences to localStorage
    localStorage.setItem('vaultx-preferences', JSON.stringify(preferences));
    
    // Apply preferences
    applyPreferences(preferences);
    
    // Notify parent component
    onPreferencesChange?.(preferences);
  }, [preferences, onPreferencesChange]);

  const applyPreferences = (prefs: UserPreferences) => {
    const root = document.documentElement;
    
    // Apply theme
    root.classList.remove('light', 'dark');
    if (prefs.theme !== 'system') {
      root.classList.add(prefs.theme);
    }
    
    // Apply font size
    root.style.setProperty('--font-size-base', getFontSize(prefs.fontSize));
    
    // Apply layout spacing
    root.style.setProperty('--spacing-base', getSpacing(prefs.layout));
    
    // Apply color scheme
    root.style.setProperty('--color-primary', getColorScheme(prefs.colorScheme));
    
    // Apply contrast
    root.style.setProperty('--contrast-multiplier', getContrast(prefs.contrast));
    
    // Apply reduced motion
    if (prefs.reducedMotion) {
      root.style.setProperty('--animation-duration', '0.1s');
    } else {
      root.style.setProperty('--animation-duration', '0.3s');
    }
  };

  const getFontSize = (size: string) => {
    switch (size) {
      case 'small': return '14px';
      case 'large': return '18px';
      default: return '16px';
    }
  };

  const getSpacing = (layout: string) => {
    switch (layout) {
      case 'compact': return '0.75rem';
      case 'spacious': return '1.5rem';
      default: return '1rem';
    }
  };

  const getColorScheme = (scheme: string) => {
    switch (scheme) {
      case 'blue': return '#3b82f6';
      case 'green': return '#10b981';
      case 'purple': return '#8b5cf6';
      case 'orange': return '#f59e0b';
      default: return '#3b82f6';
    }
  };

  const getContrast = (contrast: string) => {
    switch (contrast) {
      case 'high': return '1.5';
      case 'low': return '0.8';
      default: return '1.0';
    }
  };

  const updatePreference = <K extends keyof UserPreferences>(
    key: K, 
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const resetPreferences = () => {
    const defaultPrefs: UserPreferences = {
      theme: 'system',
      fontSize: 'medium',
      layout: 'comfortable',
      animations: 'moderate',
      colorScheme: 'default',
      contrast: 'normal',
      reducedMotion: false,
      showTooltips: true,
      autoSave: true
    };
    setPreferences(defaultPrefs);
    setShowResetConfirm(false);
  };

  const exportPreferences = () => {
    const dataStr = JSON.stringify(preferences, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vaultx-preferences.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importPreferences = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedPrefs = JSON.parse(e.target?.result as string);
          setPreferences(prev => ({ ...prev, ...importedPrefs }));
        } catch (error) {
          alert('Invalid preferences file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Personalization
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Customize your VaultX AI Tools experience
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={exportPreferences}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              title="Export preferences"
            >
              <Download className="w-4 h-4" />
            </button>
            <label className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer" title="Import preferences">
              <Upload className="w-4 h-4" />
              <input
                type="file"
                accept=".json"
                onChange={importPreferences}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {[
          { id: 'appearance', label: 'Appearance', icon: Palette },
          { id: 'accessibility', label: 'Accessibility', icon: Eye },
          { id: 'behavior', label: 'Behavior', icon: Zap },
          { id: 'advanced', label: 'Advanced', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            {/* Theme */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Theme
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['light', 'dark', 'system'] as const).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => updatePreference('theme', theme)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      preferences.theme === theme
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="text-sm font-medium capitalize">{theme}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Scheme */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Color Scheme
              </label>
              <div className="grid grid-cols-5 gap-3">
                {(['default', 'blue', 'green', 'purple', 'orange'] as const).map((scheme) => (
                  <button
                    key={scheme}
                    onClick={() => updatePreference('colorScheme', scheme)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      preferences.colorScheme === scheme
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full mx-auto mb-2 ${getColorSchemeClass(scheme)}`}></div>
                    <div className="text-xs font-medium capitalize">{scheme}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Layout */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Layout Spacing
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['compact', 'comfortable', 'spacious'] as const).map((layout) => (
                  <button
                    key={layout}
                    onClick={() => updatePreference('layout', layout)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      preferences.layout === layout
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="text-sm font-medium capitalize">{layout}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'accessibility' && (
          <div className="space-y-6">
            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Font Size
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => updatePreference('fontSize', size)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      preferences.fontSize === size
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className={`text-sm font-medium capitalize ${getFontSizeClass(size)}`}>
                      {size}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Contrast */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Contrast Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['low', 'normal', 'high'] as const).map((contrast) => (
                  <button
                    key={contrast}
                    onClick={() => updatePreference('contrast', contrast)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      preferences.contrast === contrast
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="text-sm font-medium capitalize">{contrast}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Reduced Motion
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Minimize animations for accessibility
                </p>
              </div>
              <button
                onClick={() => updatePreference('reducedMotion', !preferences.reducedMotion)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.reducedMotion ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.reducedMotion ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'behavior' && (
          <div className="space-y-6">
            {/* Animations */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Animation Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['minimal', 'moderate', 'extensive'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => updatePreference('animations', level)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      preferences.animations === level
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="text-sm font-medium capitalize">{level}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tooltips */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Show Tooltips
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Display helpful hints and information
                </p>
              </div>
              <button
                onClick={() => updatePreference('showTooltips', !preferences.showTooltips)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.showTooltips ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.showTooltips ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Auto Save */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Auto Save
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Automatically save your preferences
                </p>
              </div>
              <button
                onClick={() => updatePreference('autoSave', !preferences.autoSave)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.autoSave ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.autoSave ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-6">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                Advanced Settings
              </h3>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                These settings affect the core functionality of the application.
              </p>
            </div>

            {/* Reset Button */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Reset to Defaults
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Restore all preferences to their original values
                </p>
              </div>
              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Reset Preferences?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              This will restore all preferences to their default values. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={resetPreferences}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Reset All
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getColorSchemeClass(scheme: string): string {
  switch (scheme) {
    case 'blue': return 'bg-blue-500';
    case 'green': return 'bg-green-500';
    case 'purple': return 'bg-purple-500';
    case 'orange': return 'bg-orange-500';
    default: return 'bg-blue-500';
  }
}

function getFontSizeClass(size: string): string {
  switch (size) {
    case 'small': return 'text-xs';
    case 'large': return 'text-lg';
    default: return 'text-sm';
  }
}
