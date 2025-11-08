'use client';

import { useState, useEffect } from 'react';
import { Download, X, Smartphone, Check } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Simple check for standalone mode
    const checkIfInstalled = () => {
      if (typeof window !== 'undefined') {
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        if (isStandalone) {
          setIsInstalled(true);
          return true;
        }
      }
      return false;
    };

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after delay
      setTimeout(() => {
        if (!checkIfInstalled() && !isDismissed) {
          setShowInstallPrompt(true);
        }
      }, 3000);
    };

    // Handle app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    // Check if dismissed
    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (dismissed) {
        setIsDismissed(true);
      }
    }

    // Add event listeners
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);
    }

    // Initial check
    checkIfInstalled();

    // Cleanup
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      }
    };
  }, [isDismissed]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setShowInstallPrompt(false);
      } else {
        handleDismiss();
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('PWA installation error:', error);
      handleDismiss();
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    setIsDismissed(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pwa-install-dismissed', 'true');
    }
  };

  // Don't show if conditions not met
  if (isInstalled || isDismissed || !deferredPrompt || !showInstallPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
          <Smartphone className="w-6 h-6" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            Install VaultX Tech
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Get the app-like experience with quick access and offline functionality
          </p>
          
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
            <div className="flex items-center gap-1">
              <Check className="w-3 h-3 text-green-500" />
              <span>Quick access</span>
            </div>
            <div className="flex items-center gap-1">
              <Check className="w-3 h-3 text-green-500" />
              <span>Offline support</span>
            </div>
            <div className="flex items-center gap-1">
              <Check className="w-3 h-3 text-green-500" />
              <span>App-like UI</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleInstallClick}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              Install App
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
        
        <button
          onClick={handleDismiss}
          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex-shrink-0"
        >
          <X className="w-5 h-4" />
        </button>
      </div>
    </div>
  );
}
