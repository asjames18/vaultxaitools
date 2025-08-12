import { redirect } from 'next/navigation';
import { createClient, createClientWithCookies } from '@/lib/supabase-server';
import { canAccessAdmin } from '@/lib/auth';
import AdminDashboard from './AdminDashboard';
import { cookies } from 'next/headers';

export default async function AdminPage() {
  // Debug: Check what cookies we're receiving
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  console.log('Admin page - All cookies:', allCookies.map(c => ({ name: c.name, value: c.value.substring(0, 20) + '...' })));
  
  // Try the alternative client first
  const supabase = await createClientWithCookies();
  
  // Check session first
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  console.log('Admin page - Session check:', { 
    hasSession: !!session, 
    sessionError,
    userId: session?.user?.id,
    userEmail: session?.user?.email 
  });
  
  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  console.log('Admin page - Auth check:', { 
    user: user?.email, 
    error: authError,
    userMetadata: user?.user_metadata 
  });
  
  if (sessionError) {
    console.error('Session error in admin page:', sessionError);
    redirect('/admin/login');
  }
  
  if (authError) {
    console.error('Auth error in admin page:', authError);
    redirect('/admin/login');
  }
  
  if (!user) {
    console.log('No user found, redirecting to login');
    redirect('/admin/login');
  }
  
  // Check if user can access admin
  const canAccess = await canAccessAdmin(user);
  console.log('Admin access check:', { email: user.email, canAccess });
  
  if (!canAccess) {
    console.log('User cannot access admin, redirecting to unauthorized');
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