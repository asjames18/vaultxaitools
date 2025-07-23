import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import { canAccessAdmin } from '@/lib/auth';
import AdminDashboard from './AdminDashboard';

export default async function AdminPage() {
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  // Authentication checks disabled for debugging

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
    } else {
      console.error('Error fetching tools:', toolsError);
    }

    // Try to fetch categories
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
    
    if (!categoriesError && categoriesData) {
      categories = categoriesData;
    } else {
      console.error('Error fetching categories:', categoriesError);
    }

  } catch (error) {
    console.error('Error in admin page data fetching:', error);
    // Continue with empty arrays if there's an error
  }

  // Debug: Log the number of categories fetched
  console.log(`Admin: Fetched ${categories.length} categories from database`);
  console.log('Categories:', categories.map(c => c.name));

  return <AdminDashboard tools={tools} categories={categories} user={user as any} />;
} 