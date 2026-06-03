import { User } from '@supabase/supabase-js';
import { isAdminEmail } from './admin-emails';
import { createServiceRoleClient } from './supabase-admin';

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
  return isAdminEmail(user.email);
}

/**
 * Get user role from database or fallback to email check
 */
export async function getUserRole(user: User | null): Promise<'admin' | 'user'> {
  if (!user) return 'user';
  
  try {
    // First, try to get role from database using admin client
    const supabase = createServiceRoleClient();
    
    const { data: userRole, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();
    
    if (!error && userRole) {
      return userRole.role as 'admin' | 'user';
    }
  } catch (error) {
    // Log error internally but don't expose to user
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
 * @deprecated Use createServiceRoleClient from lib/supabase-admin
 */
export function createAdminClient() {
  return createServiceRoleClient();
}

export { createServiceRoleClient } from './supabase-admin';

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
  if (!user || !user.email) return false;
  
  // First, check if user is in the admin emails list (fastest)
  if (isAdmin(user)) {
    return true;
  }
  
  // Check if we're in a browser environment
  // NOTE: process.env.ADMIN_EMAILS is server-only (no NEXT_PUBLIC_ prefix)
  // so isAdmin() always returns false in the browser. Skip this short-circuit
  // and fall through to the DB check via getUserRole() which uses the
  // service role client and works server-side.
  if (typeof window !== 'undefined') {
    // Client-side: can't read server env vars — call server API to check
    try {
      const res = await fetch('/api/debug-admin');
      if (res.ok) {
        const data = await res.json();
        return data.isAdmin === true;
      }
    } catch {
      // fall through
    }
    return false;
  }
  
  // Server-side: try to get role from database using admin client
  try {
    const role = await getUserRole(user);
    const canAccess = role === 'admin';
    return canAccess;
  } catch (error) {
    console.error('Error checking admin role:', error);
    // Fallback to email check
    return isAdmin(user);
  }
} 