'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import { Skeleton } from './ui/Skeleton';

interface LazyLoadProps {
  children: ReactNode;
  threshold?: number;
  placeholder?: ReactNode;
  className?: string;
  onVisible?: () => void;
  once?: boolean;
}

export default function LazyLoad({
  children,
  threshold = 0.1,
  placeholder,
  className = '',
  onVisible,
  once = true
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (onVisible) onVisible();
          
          if (once) {
            setHasLoaded(true);
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '50px' // Start loading 50px before element is visible
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, onVisible, once]);

  // Default placeholder
  const defaultPlaceholder = placeholder || (
    <div className="animate-pulse">
      <Skeleton className="w-full h-32 rounded-lg" />
    </div>
  );

  return (
    <div ref={ref} className={className}>
      {!isVisible && !hasLoaded ? (
        defaultPlaceholder
      ) : (
        <div className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {children}
        </div>
      )}
    </div>
  );
}

// Specialized lazy loading components
export function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder,
  priority = false
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: ReactNode;
  priority?: boolean;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 text-gray-500 ${className}`}
        style={{ width: width || '100%', height: height || '200px' }}
      >
        <div className="text-center">
          <div className="text-2xl mb-2">🖼️</div>
          <div className="text-sm">Image failed to load</div>
        </div>
      </div>
    );
  }

  return (
    <LazyLoad
      placeholder={placeholder}
      className={className}
      once={true}
    >
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        loading={priority ? 'eager' : 'lazy'}
      />
    </LazyLoad>
  );
}

export function LazyComponent({
  children,
  fallback,
  className = ''
}: {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}) {
  return (
    <LazyLoad
      placeholder={fallback}
      className={className}
      once={true}
    >
      {children}
    </LazyLoad>
  );
}
