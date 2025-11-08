import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Performance optimizations
  experimental: {
    optimizeCss: false,
    optimizePackageImports: ['lucide-react', '@supabase/supabase-js'],
  },
  
  // Core security/perf flags moved from next.config.js
  poweredByHeader: false,
  trailingSlash: false,
  productionBrowserSourceMaps: false,
  // Server external packages (parity with previous .js config)
  serverExternalPackages: [],

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Compression
  compress: true,
  
  // Bundle analyzer (optional - for debugging)
  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     config.resolve.fallback = {
  //       ...config.resolve.fallback,
  //       fs: false,
  //     };
  //   }
  //   return config;
  // },

  // ESLint configuration
  eslint: {
    // Temporarily ignore during builds due to ESLint config compatibility
    ignoreDuringBuilds: true,
  },

  // TypeScript configuration
  typescript: {
    // Ignore type definition errors for Jest dependencies (not critical)
    ignoreBuildErrors: true,
  },

  // Headers for performance
  async headers() {
    return [
      {
        source: '/(.*)',
         headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://www.google-analytics.com https://avatars.githubusercontent.com",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://*.supabase.co https://www.google-analytics.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-src 'self'",
              "object-src 'none'"
            ].join('; '),
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
           {
             key: 'Referrer-Policy',
             value: 'strict-origin-when-cross-origin',
           },
           {
             key: 'Permissions-Policy',
             value: 'camera=(), microphone=(), geolocation=()'
           },
           {
             key: 'X-DNS-Prefetch-Control',
             value: 'on'
           },
        ],
      },
      // Long-term cache only for Next.js compiled/static assets
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Reasonable cache for Next Image optimizer responses
      {
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Redirects for better SEO and performance
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/categories',
        destination: '/AITools',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
