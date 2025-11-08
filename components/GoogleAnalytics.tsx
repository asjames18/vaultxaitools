'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface GoogleAnalyticsProps {
  measurementId?: string;
}

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const pathname = usePathname();
  
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Initialize Google Analytics if not already done
    if (!window.gtag) {
      // Load gtag script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);
      
      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };
      
      window.gtag('js', new Date());
      window.gtag('config', measurementId, {
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }, [measurementId]);

  // Track page views
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag && measurementId) {
      window.gtag('config', measurementId, {
        page_path: pathname,
        page_title: document.title,
      });
    }
  }, [pathname, measurementId]);

  // Don't render anything
  return null;
}

// Utility functions for tracking events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

export const trackPageView = (url: string, title?: string, measurementId?: string) => {
  if (typeof window !== 'undefined' && window.gtag && measurementId) {
    window.gtag('config', measurementId, {
      page_path: url,
      page_title: title,
    });
  }
};

export const trackConversion = (conversionId: string, value?: number, currency?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: `AW-${conversionId}/AW-CONVERSION_ID`,
      value: value,
      currency: currency,
    });
  }
};

export const trackSearch = (searchTerm: string, resultsCount?: number) => {
  trackEvent('search', 'engagement', searchTerm, resultsCount);
};

export const trackToolView = (toolName: string, toolCategory: string) => {
  trackEvent('view_item', 'engagement', toolName);
  trackEvent('view_item_list', 'engagement', toolCategory);
};

export const trackToolClick = (toolName: string, toolCategory: string, destination: string) => {
  trackEvent('click', 'engagement', `${toolName} -> ${destination}`);
  trackEvent('view_item', 'engagement', toolName);
};

export const trackFavorite = (toolName: string, action: 'add' | 'remove') => {
  trackEvent(action === 'add' ? 'add_to_wishlist' : 'remove_from_wishlist', 'engagement', toolName);
};

export const trackCategoryView = (categoryName: string) => {
  trackEvent('view_item_list', 'engagement', categoryName);
};

export const trackNewsletterSignup = (source: string) => {
  trackEvent('sign_up', 'engagement', `newsletter_${source}`);
};

export const trackContactForm = (formType: string) => {
  trackEvent('generate_lead', 'engagement', formType);
};
