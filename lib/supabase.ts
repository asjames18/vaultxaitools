import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
  
  // Check if we're using placeholder values
  if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseKey === 'placeholder-key') {
    console.warn('Supabase environment variables not configured. Using placeholder values.');
    // Return a mock client that won't make actual requests
    return {
      from: () => ({
        select: () => ({
          order: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
        }),
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
        }),
        insert: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
          })
        }),
        update: () => ({
          eq: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
            })
          })
        }),
        delete: () => ({
          eq: () => Promise.resolve({ error: { message: 'Supabase not configured' } })
        })
      })
    } as any;
  }
  
  return createBrowserClient(supabaseUrl, supabaseKey)
}