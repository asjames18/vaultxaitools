import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    // Return a mock client that won't crash the app
    // This allows the app to render even if Supabase isn't configured
    console.warn('Missing Supabase environment variables. Some features may not work.');
    // Create a minimal client that will fail gracefully
    return createBrowserClient(
      supabaseUrl || 'https://placeholder.supabase.co',
      supabaseKey || 'placeholder-key'
    );
  }
  
  return createBrowserClient(supabaseUrl, supabaseKey)
}