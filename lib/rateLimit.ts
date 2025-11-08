import { NextRequest, NextResponse } from 'next/server';

// In-memory store for rate limiting (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  max: number; // Maximum requests per window
  message?: string;
  statusCode?: number;
}

export function createRateLimiter(config: RateLimitConfig) {
  const { windowMs, max, message = 'Too many requests', statusCode = 429 } = config;
  
  return function rateLimit(request: NextRequest) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const now = Date.now();
    
    // Clean up expired entries
    for (const [key, value] of rateLimitStore.entries()) {
      if (now > value.resetTime) {
        rateLimitStore.delete(key);
      }
    }
    
    const key = `rate_limit:${ip}`;
    const current = rateLimitStore.get(key);
    
    if (!current || now > current.resetTime) {
      // First request or window expired
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return null; // Allow request
    }
    
    if (current.count >= max) {
      // Rate limit exceeded
      return NextResponse.json(
        { error: message },
        { status: statusCode }
      );
    }
    
    // Increment counter
    current.count++;
    return null; // Allow request
  };
}

// Pre-configured rate limiters for different admin operations
export const adminRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: 'Too many admin requests. Please try again later.'
});

export const loginRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 login attempts per 15 minutes
  message: 'Too many login attempts. Please try again later.'
});

export const sensitiveOperationRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 sensitive operations per hour
  message: 'Too many sensitive operations. Please try again later.'
});

// Public event rate limiter (analytics, error reports, etc.)
export const publicEventRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 events per minute per IP
  message: 'Too many events. Please slow down.'
});
