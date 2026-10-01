import "server-only";

import { devSubmissionStore } from "./store";
import { SupabaseSubmissionStore } from "./supabase-store";
import type { SubmissionStore } from "./store";

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
  );
}

export function getSubmissionStore(): SubmissionStore {
  return isSupabaseConfigured() ? new SupabaseSubmissionStore() : devSubmissionStore;
}
