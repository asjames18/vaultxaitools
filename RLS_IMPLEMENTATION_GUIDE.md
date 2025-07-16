# Row Level Security (RLS) Implementation Guide

## Overview

This guide explains how to implement Row Level Security (RLS) for your VaultX AI Tools application using Supabase. RLS ensures that users can only access data they're authorized to see and modify.

## Security Policies

### Tools Table Policies

1. **Public Read Access**: Anyone can read tools
2. **Service Role Full Access**: Only your backend (using service role key) can create/update/delete tools

### Reviews Table Policies

1. **Public Read Access**: Anyone can read reviews
2. **Authenticated User Insert**: Users can only create reviews with their own user_id
3. **Owner Modification**: Users can only update/delete their own reviews

## Implementation Steps

### 1. Apply RLS Policies

Run the SQL commands in `supabase-rls-policies.sql` in your Supabase SQL Editor:

```sql
-- Enable Row Level Security
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Tools policies
CREATE POLICY "Public can select tools" ON public.tools FOR SELECT USING (true);
CREATE POLICY "Service role can modify tools" ON public.tools FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Reviews policies
CREATE POLICY "Public can select reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert reviews" ON public.reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can modify their reviews" ON public.reviews FOR UPDATE, DELETE USING (auth.uid() = user_id);
```

### 2. Update Your Application Code

#### Frontend (Next.js)

Update your Supabase client calls to handle RLS:

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// For admin operations, use service role client
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
```

#### Backend (Express)

Update your server routes to use the service role for admin operations:

```javascript
// server/routes/tools.js
const { createClient } = require('@supabase/supabase-js')

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// POST /api/tools - Create new tool (Admin only)
router.post('/', authMiddleware, validateTool, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin only.' });
  }
  
  try {
    const { data, error } = await supabaseAdmin
      .from('tools')
      .insert(req.body)
      .select()
      .single()
    
    if (error) throw error
    res.status(201).json(data)
  } catch (error) {
    res.status(500).json({ error: 'Error creating tool', message: error.message })
  }
})
```

### 3. Environment Variables

Add the service role key to your environment variables:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# .env (server)
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Testing RLS Policies

### 1. Test Public Access

```typescript
// Test that anonymous users can read tools
const { data: tools, error } = await supabase
  .from('tools')
  .select('*')

console.log('Public tools access:', tools?.length || 0)
```

### 2. Test Authenticated User Access

```typescript
// Test that authenticated users can create reviews
const { data: user } = await supabase.auth.getUser()
if (user) {
  const { data: review, error } = await supabase
    .from('reviews')
    .insert({
      tool_id: 'some-tool-id',
      user_id: user.id,
      rating: 5,
      comment: 'Great tool!'
    })
    .select()
    .single()
  
  console.log('Review created:', review)
}
```

### 3. Test Admin Access

```typescript
// Test that service role can modify tools
const { data: tool, error } = await supabaseAdmin
  .from('tools')
  .insert({
    name: 'Test Tool',
    description: 'Test description',
    category: 'Test'
  })
  .select()
  .single()

console.log('Admin tool creation:', tool)
```

## Security Best Practices

### 1. Never Expose Service Role Key

- Keep service role key server-side only
- Never include it in client-side code
- Use environment variables for all keys

### 2. Validate User Permissions

```typescript
// Always check user permissions before operations
const { data: { user } } = await supabase.auth.getUser()
if (!user) {
  throw new Error('User not authenticated')
}

// Check if user owns the resource
const { data: review } = await supabase
  .from('reviews')
  .select('user_id')
  .eq('id', reviewId)
  .single()

if (review.user_id !== user.id) {
  throw new Error('Unauthorized')
}
```

### 3. Use Prepared Statements

```typescript
// Use parameterized queries to prevent SQL injection
const { data, error } = await supabase
  .from('tools')
  .select('*')
  .eq('category', category)
  .gte('rating', minRating)
```

### 4. Audit Logging

Consider adding audit logs for sensitive operations:

```sql
-- Create audit log table
CREATE TABLE audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to log changes
CREATE OR REPLACE FUNCTION log_audit_event()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (user_id, action, table_name, record_id, old_data, new_data)
  VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add triggers to tables
CREATE TRIGGER audit_tools_changes
  AFTER INSERT OR UPDATE OR DELETE ON tools
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();
```

## Troubleshooting

### Common Issues

1. **"new row violates row-level security policy"**
   - Check that the user has the correct role
   - Verify the policy conditions match your data

2. **"permission denied for table"**
   - Ensure RLS is enabled on the table
   - Check that appropriate policies exist

3. **Service role operations failing**
   - Verify the service role key is correct
   - Ensure the service role has the necessary permissions

### Debug Queries

```sql
-- Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('tools', 'reviews');

-- List policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename IN ('tools', 'reviews');

-- Test policy conditions
SELECT auth.uid() as current_user_id;
```

## Migration Strategy

1. **Development**: Test RLS policies thoroughly in development
2. **Staging**: Apply policies to staging environment
3. **Production**: Apply policies during low-traffic periods
4. **Rollback**: Keep backup of pre-RLS data and policies

## Monitoring

Set up monitoring for RLS policy violations:

```sql
-- Create a view for policy violations
CREATE VIEW rls_violations AS
SELECT 
  schemaname,
  tablename,
  policyname,
  COUNT(*) as violation_count
FROM pg_stat_user_tables
WHERE schemaname = 'public'
  AND tablename IN ('tools', 'reviews')
GROUP BY schemaname, tablename, policyname;
```

This implementation ensures your application has robust security while maintaining good performance and user experience. 