import "server-only";

import { devSubmissionStore } from "./store";
import { SupabaseSubmissionStore } from "./supabase-store";
import type { SubmissionStore } from "./store";

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() &&
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  );
}

export function getSubmissionStore(): SubmissionStore {
  if (isSupabaseConfigured()) {
    return new SupabaseSubmissionStore();
  }

  return devSubmissionStore;
}

export { isSupabaseConfigured };
