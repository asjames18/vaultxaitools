import { createClient } from '@supabase/supabase-js';
import { User } from '@supabase/supabase-js';

// Admin emails that have admin privileges (fallback)
const ADMIN_EMAILS = [
  'asjames18@gmail.com',
  'asjames18@proton.me',
  // Add more admin emails as needed
];

export interface UserRole {
  id: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
}

/**
 * Check if a user has admin privileges
 */
export function isAdmin(user: User | null): boolean {
  if (!user || !user.email) return false;
  return ADMIN_EMAILS.includes(user.email.toLowerCase());
}

/**
 * Get user role from database or fallback to email check
 */
export async function getUserRole(user: User | null): Promise<'admin' | 'user'> {
  if (!user) return 'user';
  
  try {
    // First, try to get role from database
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const { data: userRole, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();
    
    if (!error && userRole) {
      return userRole.role as 'admin' | 'user';
    }
  } catch (error) {
    console.error('Error fetching user role from database:', error);
  }
  
  // Fallback to email check
  if (user.user_metadata?.role) {
    return user.user_metadata.role;
  }
  
  if (isAdmin(user)) {
    return 'admin';
  }
  
  return 'user';
}

/**
 * Create admin client for server-side operations
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'
  
  return createClient(supabaseUrl, supabaseServiceKey)
}

/**
 * Update user role in Supabase
 */
export async function updateUserRole(userId: string, role: 'admin' | 'user') {
  const supabase = createAdminClient();
  
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: { role }
  });
  
  return { error };
}

/**
 * Get all users with their roles
 */
export async function getUsersWithRoles(): Promise<UserRole[]> {
  const supabase = createAdminClient();
  
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  
  if (error) {
    throw error;
  }
  
  const usersWithRoles = await Promise.all(
    users.map(async (user) => ({
      id: user.id,
      email: user.email || '',
      role: await getUserRole(user),
      created_at: user.created_at
    }))
  );
  
  return usersWithRoles;
}

/**
 * Check if user can access admin area
 */
export async function canAccessAdmin(user: User | null): Promise<boolean> {
  const role = await getUserRole(user);
  return role === 'admin';
} 