"use server";

import { getSupabaseAdmin } from "@/lib/supabase-admin";
import type { Product } from "@/lib/products/types";

interface RecordClickParams {
  productId: string;
  productSlug: string;
  destination: string;
  source?: string;
}

export async function recordClick(params: RecordClickParams): Promise<void> {
  // Fire and forget — tracking must never block the redirect.
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  (async () => {
    try {
      // In-memory tracking (always works, even without Supabase)
      // This is the dev fallback; in production Supabase takes over.
      const event = {
        id: crypto.randomUUID(),
        product_id: params.productId,
        product_slug: params.productSlug,
        destination: params.destination,
        source: params.source,
        created_at: new Date().toISOString(),
      };

      // Try persistent Supabase storage if configured
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
      if (serviceKey) {
        const { error } = await getSupabaseAdmin().from("clicks").insert({
          id: crypto.randomUUID(),
          product_id: params.productId,
          referrer: params.source || null,
          created_at: new Date().toISOString(),
        });
        if (error) {
          console.error("Supabase click tracking insert failed:", error.message);
        }
      }
    } catch (error) {
      // Click tracking is best-effort; never fail the redirect.
      console.error("Click tracking error:", error);
    }
  })();
}
