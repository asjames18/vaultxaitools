'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { canAccessAdmin } from '@/lib/auth';
import { User } from '@supabase/supabase-js';

interface AdminAuthWrapperProps {
  children: (user: User) => React.ReactNode;
}

export default function AdminAuthWrapper({ children }: AdminAuthWrapperProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [canAccess, setCanAccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkAuth() {
      try {
        // Check if user is authenticated on the client side
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Auth error:', error);
          router.push('/admin/login');
          return;
        }

        if (user) {
          setUser(user);
          
          // Check admin access
          const hasAccess = await canAccessAdmin(user);
          setCanAccess(hasAccess);
          
          if (!hasAccess) {
            router.push('/admin/unauthorized');
            return;
          }
        } else {
          router.push('/admin/login');
          return;
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!canAccess || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children(user)}</>;
}
