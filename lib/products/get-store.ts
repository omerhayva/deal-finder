import 'server-only';

import { devProductStore } from './store';
import { SupabaseProductStore } from './supabase-store';
import type { ProductRepository } from './store';

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() &&
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  );
}

export function getProductStore(): ProductRepository {
  if (isSupabaseConfigured()) {
    return new SupabaseProductStore();
  }
  return devProductStore;
}

export { isSupabaseConfigured };
