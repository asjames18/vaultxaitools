import { useEffect, useCallback, useRef } from 'react';
import { subscribeToUpdates, triggerGlobalUpdate } from './revalidate';

/**
 * Hook for components to listen for data updates and refresh their data
 * This provides real-time synchronization between admin portal and frontend
 */
export function useDataUpdates(
  onUpdate: (type: 'tools' | 'categories' | 'all') => void,
  dependencies: any[] = []
) {
  const onUpdateRef = useRef(onUpdate);
  
  // Update ref when callback changes
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  // Subscribe to global updates
  useEffect(() => {
    const unsubscribe = subscribeToUpdates((event) => {
      const { type } = event.detail;
      console.log(`🔄 Component received update: ${type}`);
      onUpdateRef.current(type);
    });

    return unsubscribe;
  }, dependencies);

  // Function to trigger updates from this component
  const triggerUpdate = useCallback((type: 'tools' | 'categories' | 'all' = 'all') => {
    console.log(`🔄 Component triggering update: ${type}`);
    triggerGlobalUpdate(type);
  }, []);

  return { triggerUpdate };
}

/**
 * Hook specifically for tools data updates
 */
export function useToolsUpdates(onToolsUpdate: () => void, dependencies: any[] = []) {
  const handleUpdate = useCallback((type: 'tools' | 'categories' | 'all') => {
    if (type === 'tools' || type === 'all') {
      onToolsUpdate();
    }
  }, [onToolsUpdate]);

  return useDataUpdates(handleUpdate, dependencies);
}

/**
 * Hook specifically for categories data updates
 */
export function useCategoriesUpdates(onCategoriesUpdate: () => void, dependencies: any[] = []) {
  const handleUpdate = useCallback((type: 'tools' | 'categories' | 'all') => {
    if (type === 'categories' || type === 'all') {
      onCategoriesUpdate();
    }
  }, [onCategoriesUpdate]);

  return useDataUpdates(handleUpdate, dependencies);
}
