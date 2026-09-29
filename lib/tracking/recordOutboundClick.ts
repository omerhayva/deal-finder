import { ClickEvent } from "./types";
import { devClickStore } from "./store";

/**
 * Record an outbound deal click.
 * Currently writes to an in-memory dev store only.
 * In production, replace with a real storage implementation
 * (database, analytics, etc.) — see TODO below.
 */
export function recordOutboundClick(params: {
  productId: string;
  productSlug: string;
  destination: string;
  source?: string;
}): void {
  const event: ClickEvent = {
    productId: params.productId,
    productSlug: params.productSlug,
    timestamp: new Date().toISOString(),
    destination: params.destination,
    source: params.source,
  };

  // Development / local smoke test only — events are lost on restart.
  devClickStore.record(event);

  // TODO: wire up persistent storage here when ready.
  // Example shapes:
  // - insert into a SQL/Postgres table via a server action or DB client
  // - send to a lightweight analytics endpoint
  // - write to a flat file / CMS for small sites
  //
  // The ClickEvent model above is designed to be portable —
  // same shape can be fed to any storage backend later.
}
