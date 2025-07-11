import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getTools, getCategories } from '@/lib/database';
import { canAccessAdmin } from '@/lib/auth';
import AdminDashboard from './AdminDashboard';

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient();
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/admin/login');
  }

  // Check if user has admin privileges
  if (!canAccessAdmin(user)) {
    redirect('/admin/unauthorized');
  }

  // Fetch data for the dashboard
  const tools = await getTools();
  const categories = await getCategories();

  // Debug: Log the number of categories fetched
  console.log(`Admin: Fetched ${categories.length} categories from database`);
  console.log('Categories:', categories.map(c => c.name));

  return <AdminDashboard tools={tools} categories={categories} user={user} />;
} 