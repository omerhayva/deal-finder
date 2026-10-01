import type { Product } from "./types";
import type { Locale } from "./i18n/messages";

const localeTag: Record<Locale, string> = { en: "en-US", tr: "tr-TR" };

export function formatPrice(value: number, currency = "USD", locale: Locale = "en"): string {
  const safeCurrency = /^[A-Z]{3}$/.test(currency) ? currency : "USD";
  return new Intl.NumberFormat(localeTag[locale], {
    style: "currency",
    currency: safeCurrency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(value?: string, locale: Locale = "en"): string {
  if (!value) return "—";
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00.000Z`)
    : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(localeTag[locale], {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function searchProducts(items: Product[], query: string): Product[] {
  const normalized = query.trim().toLocaleLowerCase("tr-TR");
  if (!normalized) return items;
  return items.filter((product) =>
    [product.title, product.shop, product.category, product.couponCode]
      .filter(Boolean)
      .some((field) => field.toLocaleLowerCase("tr-TR").includes(normalized)),
  );
}
