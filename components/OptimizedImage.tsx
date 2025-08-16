'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Skeleton } from './ui/Skeleton';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  quality?: number;
  fill?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  placeholder = 'blur',
  blurDataURL,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 75,
  fill = false,
  objectFit = 'cover'
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Generate blur placeholder if not provided
  const generateBlurPlaceholder = () => {
    if (blurDataURL) return blurDataURL;
    
    // Create a simple SVG blur placeholder
    const svg = `
      <svg width="${width || 400}" height="${height || 300}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" font-family="system-ui" font-size="14" fill="#9ca3af" text-anchor="middle" dy=".3em">
          Loading...
        </text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

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
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <Skeleton 
          className="absolute inset-0 z-10"
          style={{ width: '100%', height: '100%' }}
        />
      )}
      
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        style={fill ? { objectFit } : undefined}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={generateBlurPlaceholder()}
        sizes={sizes}
        quality={quality}
        fill={fill}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
}
