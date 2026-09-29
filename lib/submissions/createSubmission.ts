import { Submission, SubmissionStatus, SubmissionCategory } from "./types";

export type SubmissionValidationError =
  | "shopUrl_invalid"
  | "productUrl_invalid"
  | "title_empty"
  | "originalPrice_invalid"
  | "discountedPrice_invalid"
  | "discountedPrice_gt_original"
  | "category_invalid";

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

function isHttpUrl(value: string): boolean {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidCategory(value: string): value is SubmissionCategory {
  return [
    "Wedding",
    "Home Decor",
    "Digital Products",
    "Gifts",
    "Jewelry",
    "Clothing",
    "Printable",
    "Wall Art",
  ].includes(value as SubmissionCategory);
}

function toNumber(value: number | string): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export function validateSubmission(raw: {
  sellerShopUrl: string;
  productUrl: string;
  title: string;
  imageUrl?: string;
  originalPrice: number | string;
  discountedPrice: number | string;
  couponCode?: string;
  expiresAt?: string;
  category: string;
  description?: string;
}): ValidationResult {
  const errors: SubmissionValidationError[] = [];

  if (!isHttpUrl(raw.sellerShopUrl)) {
    errors.push("shopUrl_invalid");
  }
  if (!isHttpUrl(raw.productUrl)) {
    errors.push("productUrl_invalid");
  }
  if (typeof raw.title !== "string" || raw.title.trim().length === 0) {
    errors.push("title_empty");
  }
  const orig = toNumber(raw.originalPrice);
  if (orig == null || orig <= 0) {
    errors.push("originalPrice_invalid");
  }
  const disc = toNumber(raw.discountedPrice);
  if (disc == null) {
    errors.push("discountedPrice_invalid");
  } else if (disc < 0) {
    errors.push("discountedPrice_invalid");
  } else if (orig != null && disc > orig) {
    errors.push("discountedPrice_gt_original");
  }
  if (!isValidCategory(raw.category)) {
    errors.push("category_invalid");
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      sellerShopUrl: raw.sellerShopUrl,
      productUrl: raw.productUrl,
      title: raw.title.trim(),
      imageUrl: raw.imageUrl?.trim() || undefined,
      originalPrice: orig!,
      discountedPrice: disc!,
      couponCode: raw.couponCode?.trim() || undefined,
      expiresAt: raw.expiresAt || undefined,
      category: raw.category as SubmissionCategory,
      description: raw.description?.trim() || undefined,
    },
  };
}

export function createSubmission(validated: ValidationOkData): Submission {
  return {
    id: crypto.randomUUID(),
    sellerShopUrl: validated.sellerShopUrl,
    productUrl: validated.productUrl,
    title: validated.title,
    imageUrl: validated.imageUrl,
    originalPrice: validated.originalPrice,
    discountedPrice: validated.discountedPrice,
    couponCode: validated.couponCode,
    expiresAt: validated.expiresAt,
    category: validated.category,
    description: validated.description,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
}
