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
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#4ade80]/30 border-t-[#4ade80] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!canAccess) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-500 text-sm">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <AdminDashboard tools={tools} categories={categories} user={user as any} />;
}