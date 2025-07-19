'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

// Security: Sanitize URLs to prevent XSS
export const sanitizeUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return '#';
    }
    return url;
  } catch {
    return '#';
  }
};

// Security: Sanitize text content
export const sanitizeText = (text: string): string => {
  if (typeof text !== 'string') return '';
  // Remove potentially dangerous HTML
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

// Performance: Debounce function for search
export const useDebounce = (value: string, delay: number): string => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Performance: Intersection Observer for lazy loading
export const useIntersectionObserver = (
  callback: () => void,
  options: IntersectionObserverInit = {}
) => {
  const [ref, setRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback();
        }
      });
    }, options);

    observer.observe(ref);

    return () => {
      observer.disconnect();
    };
  }, [ref, callback, options]);

  return setRef;
};

// Performance: Virtual scrolling helper
export const useVirtualScroll = (
  items: any[],
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );

    return items.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      index: startIndex + index,
      style: {
        position: 'absolute' as const,
        top: (startIndex + index) * itemHeight,
        height: itemHeight,
        width: '100%',
      },
    }));
  }, [items, itemHeight, containerHeight, scrollTop]);

  const totalHeight = items.length * itemHeight;

  return {
    visibleItems,
    totalHeight,
    onScroll: (e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    },
  };
};

// Performance: Memory efficient image loading
export const useImageLoader = (src: string | undefined) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.onload = () => setLoaded(true);
    img.onerror = () => setError(true);
    img.src = sanitizeUrl(src);

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return { loaded, error };
};

// Security: Rate limiting for API calls
export const useRateLimit = (limit: number, windowMs: number) => {
  const [calls, setCalls] = useState<number[]>([]);

  const canCall = useCallback(() => {
    const now = Date.now();
    const validCalls = calls.filter(time => now - time < windowMs);
    return validCalls.length < limit;
  }, [calls, limit, windowMs]);

  const recordCall = useCallback(() => {
    const now = Date.now();
    setCalls(prev => [...prev.filter(time => now - time < windowMs), now]);
  }, [windowMs]);

  return { canCall, recordCall };
};

// Performance: Caching with TTL
export const useCache = <T>(ttl: number = 5 * 60 * 1000) => {
  const cache = useMemo(() => new Map<string, { data: T; timestamp: number }>(), []);

  const get = useCallback((key: string): T | null => {
    const item = cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > ttl) {
      cache.delete(key);
      return null;
    }
    
    return item.data;
  }, [cache, ttl]);

  const set = useCallback((key: string, data: T) => {
    cache.set(key, { data, timestamp: Date.now() });
  }, [cache]);

  const clear = useCallback(() => {
    cache.clear();
  }, [cache]);

  return { get, set, clear };
};

// Security: Input validation
export const validateSearchInput = (input: string): boolean => {
  if (typeof input !== 'string') return false;
  if (input.length > 100) return false; // Prevent very long searches
  if (/[<>]/.test(input)) return false; // Prevent HTML injection
  return true;
};

// Performance: Throttle function for scroll events
export const useThrottle = (callback: () => void, delay: number) => {
  const [isThrottled, setIsThrottled] = useState(false);

  const throttledCallback = useCallback(() => {
    if (!isThrottled) {
      callback();
      setIsThrottled(true);
      setTimeout(() => setIsThrottled(false), delay);
    }
  }, [callback, delay, isThrottled]);

  return throttledCallback;
};

// Security: Safe fetch with timeout and validation
export const safeFetch = async (
  url: string,
  options: RequestInit = {},
  timeout: number = 10000
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(sanitizeUrl(url), {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// Performance: Preload critical resources
export const preloadResources = (urls: string[]) => {
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = sanitizeUrl(url);
    link.as = 'fetch';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Security: Content Security Policy helper
export const getCSPNonce = (): string => {
  // In a real app, this would come from your server
  return Math.random().toString(36).substring(2, 15);
};

// Performance: Service Worker registration for caching
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered: ', registration);
    } catch (registrationError) {
      console.log('SW registration failed: ', registrationError);
    }
  }
}; 