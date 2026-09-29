import "server-only";

import { createClient, SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (cachedClient) return cachedClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL is not set. Supabase is not configured for this environment."
    );
  }

  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseServiceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Supabase is not configured for this environment."
    );
  }

  cachedClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return cachedClient;
}
