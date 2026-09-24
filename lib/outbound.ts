/**
 * Outbound link abstraction.
 * Replace the href target with a tracking intermediary when real analytics
 * is connected. For now this is a no-op wrapper that preserves the current
 * redirect behaviour through /go/[productId].
 */

export type OutboundTarget = {
  /** Product or deal identifier for analytics */
  id: string;
  /** External destination URL (e.g. Etsy product page) */
  url: string;
  /** Human-readable destination name for logs/UI */
  label: string;
};

/**
 * Build an outbound URL.
 * Currently delegates to the existing /go/[productId] redirect route so
 * click tracking can be added there without changing every CTA.
 */
export function outboundUrl(target: OutboundTarget): string {
  // Future: inject tracking params, affiliate IDs, or analytics ping.
  // For now route through the existing redirect endpoint.
  return `/go/${target.id}`;
}

/**
 * Default CTA label for outbound deal links.
 */
export const OUTBOUND_CTA_LABEL = "View Deal";
