import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import { canAccessAdmin } from '@/lib/auth';
import AutomationDashboard from './AutomationDashboard';

export default async function AutomationPage() {
  // Temporarily simplified for build stability
  return <div>Automation Dashboard</div>;
} 