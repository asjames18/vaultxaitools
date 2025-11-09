import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase';

interface OptimizedSubscriptionsReturn {
  showUpdateBanner: boolean;
  lastDataUpdate: Date;
  automationStatus: any;
  hideUpdateBanner: () => void;
}

export function useOptimizedSubscriptions(): OptimizedSubscriptionsReturn {
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [lastDataUpdate, setLastDataUpdate] = useState<Date>(new Date());
  const [automationStatus, setAutomationStatus] = useState<any>(null);
  
  const subscribedRef = useRef(false);
  const bannerTimeoutRef = useRef<NodeJS.Timeout>();
  const refreshTimeoutRef = useRef<NodeJS.Timeout>();

  // Cleanup function
  const cleanup = useCallback(() => {
    if (bannerTimeoutRef.current) {
      clearTimeout(bannerTimeoutRef.current);
    }
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
  }, []);

  // Hide update banner manually
  const hideUpdateBanner = useCallback(() => {
    setShowUpdateBanner(false);
    cleanup();
  }, [cleanup]);

  // Fetch automation status only once
  const fetchAutomationStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/automation');
      if (response.ok) {
        const data = await response.json();
        setAutomationStatus(data);
      }
    } catch (error) {
      // Silently handle automation status errors
    }
  }, []);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return;
    }
    
    // Prevent duplicate subscriptions
    if (subscribedRef.current) {
      return;
    }
    subscribedRef.current = true;

    // Safely create Supabase client
    let supabase: any = null;
    try {
      supabase = createClient();
    } catch (err) {
      // Silently fail if client creation fails
      return;
    }
    
    if (!supabase) {
      return;
    }

    // Fetch automation status once on mount
    fetchAutomationStatus();

    // Subscribe to automation updates with optimized handling
    const automationChannel = supabase
      .channel('automation-updates')
      .on('broadcast', { event: 'automation-completed' }, (payload: any) => {
        setLastDataUpdate(new Date());
        setShowUpdateBanner(true);
        
        // Auto-hide banner after 10 seconds
        bannerTimeoutRef.current = setTimeout(() => {
          setShowUpdateBanner(false);
        }, 10000);
        
        // Optionally refresh the page to get new data (debounced)
        if (refreshTimeoutRef.current) {
          clearTimeout(refreshTimeoutRef.current);
        }
        refreshTimeoutRef.current = setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.location.reload();
          }
        }, 2000);
      })
      .subscribe();

    return () => {
      subscribedRef.current = false;
      if (automationChannel) {
        automationChannel.unsubscribe();
      }
      cleanup();
    };
  }, [fetchAutomationStatus, cleanup]);

  return {
    showUpdateBanner,
    lastDataUpdate,
    automationStatus,
    hideUpdateBanner
  };
}

