/** @deprecated Import createClient from @/lib/supabase instead */
export { createClient } from './supabase';

import { createClient as createBrowserClient } from './supabase';

export const supabase = createBrowserClient();
