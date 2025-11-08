/**
 * Enhanced revalidation system that combines server-side revalidation
 * with client-side data refresh for immediate frontend updates
 */

// Global event system for real-time updates
const updateEvents = new EventTarget();

/**
 * Trigger a global update event that components can listen to
 */
export function triggerGlobalUpdate(type: 'tools' | 'categories' | 'all' = 'all') {
  console.log(`🔄 Triggering global update: ${type}`);
  updateEvents.dispatchEvent(new CustomEvent('data-update', { detail: { type } }));
}

/**
 * Subscribe to global update events
 */
export function subscribeToUpdates(callback: (event: CustomEvent) => void) {
  updateEvents.addEventListener('data-update', callback as EventListener);
  
  // Return unsubscribe function
  return () => {
    updateEvents.removeEventListener('data-update', callback as EventListener);
  };
}

/**
 * Enhanced revalidation that combines server-side and client-side updates
 */
export async function revalidateToolsPages(): Promise<boolean> {
  try {
    console.log('🔄 Starting comprehensive revalidation...');
    
    // 1. Trigger server-side revalidation
    const serverResult = await triggerServerRevalidation();
    
    // 2. Trigger client-side updates
    triggerGlobalUpdate('tools');
    
    // 3. Force browser cache refresh for critical pages
    await forceBrowserRefresh();
    
    console.log('✅ Comprehensive revalidation completed');
    return serverResult;

  } catch (error) {
    console.error('❌ Error during comprehensive revalidation:', error);
    return false;
  }
}

/**
 * Trigger server-side revalidation via API
 */
async function triggerServerRevalidation(): Promise<boolean> {
  try {
    const response = await fetch('/api/revalidate/tools', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paths: [
          '/',           // Home page
          '/AITools',    // All tools page
          '/categories', // Categories overview
        ]
      }),
    });

    if (!response.ok) {
      throw new Error(`Server revalidation failed: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Server-side revalidation completed:', result);
    return true;

  } catch (error) {
    console.error('❌ Server revalidation error:', error);
    return false;
  }
}

/**
 * Force browser to refresh critical pages
 */
async function forceBrowserRefresh(): Promise<void> {
  try {
    // For critical pages, we can force a refresh by updating the URL
    // This is a fallback when revalidation doesn't work
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const criticalPaths = ['/', '/AITools', '/categories'];
      
      if (criticalPaths.includes(currentPath)) {
        console.log('🔄 Current page is critical, triggering soft refresh...');
        // Add a timestamp to force refresh without full page reload
        const url = new URL(window.location.href);
        url.searchParams.set('_t', Date.now().toString());
        window.history.replaceState({}, '', url.toString());
      }
    }
  } catch (error) {
    console.error('❌ Browser refresh error:', error);
  }
}

/**
 * Revalidate specific category pages
 */
export async function revalidateCategoryPages(categoryNames: string[]): Promise<boolean> {
  try {
    console.log('🔄 Starting category revalidation...');
    
    // Generate category paths
    const categoryPaths = categoryNames.map(name => 
      `/categories/${name.toLowerCase().replace(/\s+/g, '-')}`
    );

    const allPaths = [
      '/',           // Home page
      '/AITools',    // All tools page
      '/categories', // Categories overview
      ...categoryPaths
    ];
    
    // Server-side revalidation
    const response = await fetch('/api/revalidate/tools', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paths: allPaths
      }),
    });

    if (!response.ok) {
      throw new Error(`Category revalidation failed: ${response.status}`);
    }

    // Client-side updates
    triggerGlobalUpdate('categories');
    
    const result = await response.json();
    console.log('✅ Category revalidation completed:', result);
    return true;

  } catch (error) {
    console.error('❌ Category revalidation error:', error);
    return false;
  }
}

/**
 * Force immediate refresh of all tool-related data
 */
export async function forceRefreshAllData(): Promise<void> {
  try {
    console.log('🔄 Force refreshing all data...');
    
    // Trigger all types of updates
    triggerGlobalUpdate('all');
    
    // Server revalidation
    await triggerServerRevalidation();
    
    // Browser refresh for critical pages
    await forceBrowserRefresh();
    
    console.log('✅ Force refresh completed');
  } catch (error) {
    console.error('❌ Force refresh error:', error);
  }
}
