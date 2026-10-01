import "server-only";
import { canonicalEtsyUrl } from "@/lib/etsy";

export type ImportedEtsyListing = {
  sellerShopUrl: string;
  productUrl: string;
  title: string;
  imageUrl?: string;
  originalPrice: number;
  discountedPrice: number;
  description?: string;
  category: "General";
};

export type EtsyImportResult =
  | { ok: true; listing: ImportedEtsyListing }
  | { ok: false; reason: "not_configured" | "not_found" | "unavailable" };

type JsonRecord = Record<string, unknown>;
const API_ROOT = "https://api.etsy.com/v3/application";
const MAX_RESPONSE_BYTES = 1_000_000;

function asRecord(value: unknown): JsonRecord | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as JsonRecord
    : null;
}

function asText(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function asFiniteNumber(value: unknown): number | undefined {
  const number = typeof value === "number" || (typeof value === "string" && value.trim())
    ? Number(value)
    : NaN;
  return Number.isFinite(number) ? number : undefined;
}

function parseMoney(value: unknown): { amount: number; currency: string } | undefined {
  const record = asRecord(value);
  if (!record) return undefined;
  const amount = asFiniteNumber(record.amount);
  const divisor = asFiniteNumber(record.divisor) ?? 1;
  const currency = asText(record.currency_code)?.toUpperCase();
  if (amount === undefined || divisor <= 0 || !currency) return undefined;
  const normalizedAmount = amount / divisor;
  return Number.isFinite(normalizedAmount) && normalizedAmount > 0
    ? { amount: normalizedAmount, currency }
    : undefined;
}

function firstUsdMoney(...values: unknown[]): number | undefined {
  for (const value of values) {
    const money = parseMoney(value);
    if (money?.currency === "USD") return money.amount;
  }
  return undefined;
}

function safeImageUrl(value: unknown): string | undefined {
  const raw = asText(value);
  if (!raw || raw.length > 2048) return undefined;
  try {
    const url = new URL(raw);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      !(url.hostname === "etsystatic.com" || url.hostname.endsWith(".etsystatic.com"))
    ) return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

async function getEtsyJson(path: string, apiKey: string): Promise<{ data?: JsonRecord; status: number }> {
  const response = await fetch(`${API_ROOT}${path}`, {
    headers: { Accept: "application/json", "x-api-key": apiKey },
    cache: "no-store",
    redirect: "manual",
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) return { status: response.status };

  const contentLength = Number(response.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_RESPONSE_BYTES) {
    return { status: 502 };
  }
  const body = await response.text();
  if (new TextEncoder().encode(body).byteLength > MAX_RESPONSE_BYTES) return { status: 502 };
  try {
    const data = asRecord(JSON.parse(body));
    return data ? { data, status: response.status } : { status: 502 };
  } catch {
    return { status: 502 };
  }
}

function listingIdFromUrl(productUrl: string): string | undefined {
  const canonical = canonicalEtsyUrl(productUrl, "listing");
  const match = canonical?.match(/\/listing\/(\d+)(?:\/|$)/i);
  return match?.[1];
}

export function isEtsyApiConfigured(): boolean {
  const key = process.env.ETSY_API_KEY?.trim();
  return Boolean(key && key.includes(":"));
}

export async function importEtsyListing(productUrl: string): Promise<EtsyImportResult> {
  const canonicalUrl = canonicalEtsyUrl(productUrl, "listing");
  const listingId = canonicalUrl ? listingIdFromUrl(canonicalUrl) : undefined;
  const apiKey = process.env.ETSY_API_KEY?.trim();
  if (!apiKey || !apiKey.includes(":")) return { ok: false, reason: "not_configured" };
  if (!canonicalUrl || !listingId) return { ok: false, reason: "not_found" };

  try {
    const query = new URLSearchParams({ includes: "Images,Shop,BuyerPrice" });
    const listingResponse = await getEtsyJson(`/listings/${listingId}?${query}`, apiKey);
    if (listingResponse.status === 404) return { ok: false, reason: "not_found" };
    if (listingResponse.status !== 200 || !listingResponse.data) return { ok: false, reason: "unavailable" };

    const data = listingResponse.data;
    if (data.state !== "active") return { ok: false, reason: "not_found" };

    let shop = asRecord(data.shop) ?? asRecord(data.Shop);
    if (!shop) {
      const shopId = asFiniteNumber(data.shop_id);
      if (shopId && Number.isSafeInteger(shopId) && shopId > 0) {
        const shopResponse = await getEtsyJson(`/shops/${shopId}`, apiKey);
        if (shopResponse.status === 200) shop = shopResponse.data ?? null;
      }
    }

    const shopName = asText(shop?.shop_name) ?? asText(data.shop_name);
    if (!shopName || shopName.length > 120) return { ok: false, reason: "unavailable" };
    const shopUrl = canonicalEtsyUrl(asText(shop?.url) ?? "", "shop")
      ?? canonicalEtsyUrl(`https://www.etsy.com/shop/${encodeURIComponent(shopName)}`, "shop");
    if (!shopUrl) return { ok: false, reason: "unavailable" };

    const buyerPrice = asRecord(data.buyer_price);
    const currentPrice = firstUsdMoney(
      buyerPrice?.discounted_price,
      buyerPrice?.base_price,
      data.converted_price,
      data.price,
    );
    const originalPrice = firstUsdMoney(
      buyerPrice?.original_price,
      data.converted_price,
      data.price,
    ) ?? currentPrice;
    if (
      currentPrice === undefined ||
      originalPrice === undefined ||
      currentPrice > originalPrice ||
      originalPrice > 1_000_000
    ) return { ok: false, reason: "unavailable" };

    const title = asText(data.title);
    if (!title || title.length > 160) return { ok: false, reason: "unavailable" };
    const images = Array.isArray(data.images) ? data.images : Array.isArray(data.Images) ? data.Images : [];
    const image = asRecord(images[0]);
    const description = asText(data.description);

    return {
      ok: true,
      listing: {
        sellerShopUrl: shopUrl,
        productUrl: canonicalUrl,
        title,
        imageUrl: safeImageUrl(image?.url_fullxfull) ?? safeImageUrl(image?.url_570xN) ?? safeImageUrl(image?.url),
        originalPrice: Number(originalPrice.toFixed(2)),
        discountedPrice: Number(currentPrice.toFixed(2)),
        description: description?.slice(0, 2000),
        category: "General",
      },
    };
  } catch (error) {
    console.error("Etsy listing import failed:", error instanceof Error ? error.message : error);
    return { ok: false, reason: "unavailable" };
  }
}
