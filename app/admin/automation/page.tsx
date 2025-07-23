import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import { canAccessAdmin } from '@/lib/auth';
import AutomationDashboard from './AutomationDashboard';

export default async function AutomationPage() {
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/admin/login');
  }

  // Check if user has admin privileges
  const hasAdminAccess = await canAccessAdmin(user);
  if (!hasAdminAccess) {
    redirect('/admin/unauthorized');
  }

  return <AutomationDashboard />;
} 