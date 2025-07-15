import { createClient } from '@supabase/supabase-js';
import { User } from '@supabase/supabase-js';

// Admin emails that have admin privileges
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
 * Get user role from user metadata or email
 */
export function getUserRole(user: User | null): 'admin' | 'user' {
  if (!user) return 'user';
  
  // Check if user has role in metadata
  if (user.user_metadata?.role) {
    return user.user_metadata.role;
  }
  
  // Check if user email is in admin list
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
  
  return users.map(user => ({
    id: user.id,
    email: user.email || '',
    role: getUserRole(user),
    created_at: user.created_at
  }));
}

/**
 * Check if user can access admin area
 */
export function canAccessAdmin(user: User | null): boolean {
  return getUserRole(user) === 'admin';
} 