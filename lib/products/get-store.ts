import "server-only";

import { devProductStore, type ProductRepository } from "./store";
import { SupabaseProductStore } from "./supabase-store";

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
  );
}

export function getProductStore(): ProductRepository {
  return isSupabaseConfigured() ? new SupabaseProductStore() : devProductStore;
}
