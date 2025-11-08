'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { canAccessAdmin } from '@/lib/auth';
import AdminDashboard from './AdminDashboard';
import type { User } from '@supabase/supabase-js';

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [canAccess, setCanAccess] = useState(false);
  const [tools, setTools] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
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

          // Fetch data for the dashboard
          try {
            // Try to fetch tools
            const { data: toolsData, error: toolsError } = await supabase
              .from('tools')
              .select('*')
              .order('created_at', { ascending: false });
            
            if (!toolsError && toolsData) {
              setTools(toolsData);
            }

            // Try to fetch categories
            const { data: categoriesData, error: categoriesError } = await supabase
              .from('categories')
              .select('*')
              .order('name', { ascending: true });
            
            if (!categoriesError && categoriesData) {
              setCategories(categoriesData);
            }
          } catch (error) {
            console.error('Error fetching dashboard data:', error);
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

  if (!canAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <AdminDashboard tools={tools} categories={categories} user={user as any} />;
}