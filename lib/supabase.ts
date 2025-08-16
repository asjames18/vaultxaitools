import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
  
  // Check if we're using placeholder values
  if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseKey === 'placeholder-key') {
    // Return a mock client that won't make actual requests
    return {
      auth: {
        getSession: () => Promise.resolve({ 
          data: { 
            session: { 
              access_token: 'mock-token' 
            } 
          }, 
          error: null 
        }),
        getUser: () => Promise.resolve({ 
          data: { 
            user: { 
              id: 'mock-user-id', 
              email: 'mock@example.com' 
            } 
          }, 
          error: null 
        }),
        signOut: () => Promise.resolve({ error: null })
      },
      from: () => ({
        select: () => ({
          order: () => Promise.resolve({ data: null, error: { message: 'Service temporarily unavailable' } })
        }),
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Service temporarily unavailable' } })
        }),
        insert: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: { message: 'Service temporarily unavailable' } })
          })
        }),
        update: () => ({
          eq: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: null, error: { message: 'Service temporarily unavailable' } })
            })
          })
        }),
        delete: () => ({
          eq: () => Promise.resolve({ error: { message: 'Service temporarily unavailable' } })
        })
      })
    } as any;
  }
  
  return createBrowserClient(supabaseUrl, supabaseKey)
}