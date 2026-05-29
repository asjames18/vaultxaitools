import { createClient, SupabaseClient } from '@supabase/supabase-js';

let adminClient: SupabaseClient | null = null;

/**
 * Service-role Supabase client for admin/server operations.
 */
export function createServiceRoleClient(): SupabaseClient {
  if (!adminClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';
    adminClient = createClient(supabaseUrl, supabaseServiceKey);
  }
  return adminClient;
}

/** @deprecated Use createServiceRoleClient() */
export function createAdminClient(): SupabaseClient {
  return createServiceRoleClient();
}

/** @deprecated Use createServiceRoleClient() */
export const supabaseAdmin = createServiceRoleClient();
