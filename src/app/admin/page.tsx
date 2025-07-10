import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getTools, getCategories } from '@/lib/database';
import AdminDashboard from './AdminDashboard';

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient();
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/admin/login');
  }

  // Fetch data for the dashboard
  const tools = await getTools();
  const categories = await getCategories();

  return <AdminDashboard tools={tools} categories={categories} user={user} />;
} 