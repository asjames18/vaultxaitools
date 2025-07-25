# Production Deployment Checklist

## Environment Variables

Ensure the following environment variables are properly set in your production environment:

### Required Variables
- `NODE_ENV=production` - **CRITICAL**: Must be set to 'production'
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (server-side only)

### Debug Variables (Production Settings)
- `NEXT_PUBLIC_DEBUG=false` - Disable debug output in production

## Authentication Issue Prevention

### 1. AuthSessionMissingError Fix
The middleware has been updated to handle `AuthSessionMissingError` by:
- Detecting invalid session tokens
- Clearing invalid cookies automatically
- Gracefully handling auth state

### 2. Debug Output Prevention
Debug output is now controlled by:
- `NODE_ENV !== 'production'` check
- `NEXT_PUBLIC_DEBUG=true` flag (must be explicitly enabled)

### 3. Session Management
- Auto-refresh tokens enabled
- Persistent sessions configured
- Proper cookie handling in middleware

## Deployment Commands

### Vercel
```bash
# Set environment variables
vercel env add NODE_ENV production
vercel env add NEXT_PUBLIC_DEBUG false
vercel env add NEXT_PUBLIC_SUPABASE_URL your-supabase-url
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY your-supabase-anon-key

# Deploy
vercel --prod
```

### Other Platforms
Ensure `NODE_ENV=production` is set in your deployment platform's environment variables.

## Post-Deployment Verification

1. **Check Environment**: Visit your site and verify no debug output appears
2. **Test Authentication**: 
   - Sign in/out works correctly
   - No `AuthSessionMissingError` in console
   - Session persistence works across page refreshes
3. **Monitor Logs**: Check for any authentication errors in production logs

## Troubleshooting

If you still see debug output in production:
1. Verify `NODE_ENV=production` is set
2. Verify `NEXT_PUBLIC_DEBUG=false` or not set
3. Clear browser cache and cookies
4. Redeploy with confirmed environment variables

If you get `AuthSessionMissingError`:
1. Check Supabase project URL and keys are correct
2. Verify RLS policies allow access
3. Check cookie settings and CORS configuration
4. Ensure middleware is properly handling session refresh