/**
 * Click event model for outbound deal tracking.
 * Only collects deal-level data — no personal data, no IP, no fingerprinting.
 */
export type ClickEvent = {
  productId: string;
  productSlug: string;
  timestamp: string; // ISO 8601
  destination: string; // allowed external URL
  source?: string; // optional page where click originated
};
