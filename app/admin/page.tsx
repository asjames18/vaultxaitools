import { redirect } from 'next/navigation';
import { createClient, createClientWithCookies } from '@/lib/supabase-server';
import { canAccessAdmin } from '@/lib/auth';
import AdminDashboard from './AdminDashboard';
import { cookies } from 'next/headers';

export default async function AdminPage() {
  // Try the alternative client first
  const supabase = await createClientWithCookies();
  
  // Check session first
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (sessionError) {
    redirect('/admin/login');
  }
  
  if (authError) {
    redirect('/admin/login');
  }
  
  if (!user) {
    redirect('/admin/login');
  }
  
  // Check if user can access admin
  const canAccess = await canAccessAdmin(user);
  
  if (!canAccess) {
    redirect('/admin/unauthorized');
  }

  // Fetch data for the dashboard with error handling
  let tools = [];
  let categories = [];

  try {
    // Try to fetch tools
    const { data: toolsData, error: toolsError } = await supabase
      .from('tools')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!toolsError && toolsData) {
      tools = toolsData;
    }

    // Try to fetch categories
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
    
    if (!categoriesError && categoriesData) {
      categories = categoriesData;
    }

  } catch (error) {
    // Continue with empty arrays if there's an error
  }

  return <AdminDashboard tools={tools} categories={categories} user={user as any} />;
} 