import type { Submission, SubmissionCategory } from "./types";
import { PRODUCT_CATEGORIES } from "@/lib/types";
import { canonicalEtsyUrl } from "@/lib/etsy";

export type SubmissionValidationError =
  | "shopUrl_invalid"
  | "productUrl_invalid"
  | "imageUrl_invalid"
  | "title_empty"
  | "title_too_long"
  | "originalPrice_invalid"
  | "discountedPrice_invalid"
  | "discountedPrice_gt_original"
  | "category_invalid"
  | "expiresAt_invalid";

export type ValidationOkData = {
  sellerShopUrl: string;
  productUrl: string;
  title: string;
  imageUrl?: string;
  originalPrice: number;
  discountedPrice: number;
  couponCode?: string;
  expiresAt?: string;
  category: SubmissionCategory;
  description?: string;
};

export type ValidationResult =
  | { ok: true; data: ValidationOkData }
  | { ok: false; errors: SubmissionValidationError[] };

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asOptionalString(value: unknown): string | undefined {
  const result = asString(value).trim();
  return result || undefined;
}

function toNumber(value: unknown): number | null {
  if (typeof value !== "number" && typeof value !== "string") return null;
  if (typeof value === "string" && !value.trim()) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function validateSubmission(rawValue: unknown): ValidationResult {
  const raw = asRecord(rawValue);
  const errors: SubmissionValidationError[] = [];
  const shopUrl = canonicalEtsyUrl(asString(raw.sellerShopUrl), "shop");
  const productUrl = canonicalEtsyUrl(asString(raw.productUrl), "listing");
  const imageValue = asOptionalString(raw.imageUrl);
  const title = asString(raw.title).trim();
  const originalPrice = toNumber(raw.originalPrice);
  const discountedPrice = toNumber(raw.discountedPrice);
  const category = asString(raw.category);
  const expiresAt = asOptionalString(raw.expiresAt);

  if (!shopUrl) errors.push("shopUrl_invalid");
  if (!productUrl) errors.push("productUrl_invalid");
  if (imageValue) {
    try {
      const imageUrl = new URL(imageValue);
      if (imageUrl.protocol !== "https:" || imageUrl.username || imageUrl.password || imageValue.length > 2048) {
        errors.push("imageUrl_invalid");
      }
    } catch {
      errors.push("imageUrl_invalid");
    }
  }
  if (!title) errors.push("title_empty");
  else if (title.length > 160) errors.push("title_too_long");

  if (originalPrice === null || originalPrice <= 0 || originalPrice > 1_000_000) {
    errors.push("originalPrice_invalid");
  }
  if (discountedPrice === null || discountedPrice <= 0 || discountedPrice > 1_000_000) {
    errors.push("discountedPrice_invalid");
  } else if (originalPrice !== null && discountedPrice > originalPrice) {
    errors.push("discountedPrice_gt_original");
  }
  if (category !== "General" && !PRODUCT_CATEGORIES.includes(category as Exclude<SubmissionCategory, "General">)) {
    errors.push("category_invalid");
  }
  if (expiresAt && !isValidDate(expiresAt)) errors.push("expiresAt_invalid");

  if (errors.length > 0 || !shopUrl || !productUrl || originalPrice === null || discountedPrice === null) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      sellerShopUrl: shopUrl,
      productUrl,
      title,
      imageUrl: imageValue,
      originalPrice,
      discountedPrice,
      couponCode: asOptionalString(raw.couponCode)?.slice(0, 80),
      expiresAt,
      category: category as SubmissionCategory,
      description: asOptionalString(raw.description)?.slice(0, 2000),
    },
  };
}

export function createSubmission(validated: ValidationOkData): Submission {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    ...validated,
    status: "pending",
    createdAt: now,
    consentAcceptedAt: now,
  };
}
