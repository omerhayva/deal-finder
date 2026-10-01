export type EtsyUrlKind = "shop" | "listing";

/** Returns a clean canonical Etsy URL or null when the host/path is not an Etsy shop/listing. */
export function canonicalEtsyUrl(value: string, kind: EtsyUrlKind): string | null {
  if (typeof value !== "string" || value.length > 2048) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" || !["etsy.com", "www.etsy.com"].includes(url.hostname.toLowerCase())) return null;
    if (url.username || url.password) return null;

    const validPath = kind === "shop"
      ? /^\/(?:shop|people)\/[^/]+(?:\/|$)/i.test(url.pathname)
      : /^\/(?:[a-z]{2}(?:-[a-z]{2})?\/)?listing\/\d+(?:\/|$)/i.test(url.pathname);
    if (!validPath) return null;

    return `https://www.etsy.com${url.pathname.replace(/\/+$/, "")}`;
  } catch {
    return null;
  }
}
