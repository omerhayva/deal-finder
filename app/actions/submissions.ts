"use server";

import { createHmac } from "node:crypto";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/admin/auth";
import { getProductStore } from "@/lib/products/get-store";
import type { Product } from "@/lib/products/types";
import { productCategoryValidate } from "@/lib/types";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { createSubmission, validateSubmission } from "@/lib/submissions/createSubmission";
import { getSubmissionStore, isSupabaseConfigured } from "@/lib/submissions/get-store";
import { importEtsyListing, isEtsyApiConfigured } from "@/lib/etsy-api";
import { canonicalEtsyUrl } from "@/lib/etsy";
import type { Submission } from "@/lib/submissions/types";

const FREE_TRIAL_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

async function isSellerTrialExpired(shopUrl: string): Promise<boolean> {
  const firstApprovedAt = await getSubmissionStore().getFirstApprovedAtForShop(shopUrl);
  if (!firstApprovedAt) return false;
  const startedAt = Date.parse(firstApprovedAt);
  if (!Number.isFinite(startedAt)) throw new Error("Invalid seller trial start date.");
  return Date.now() >= startedAt + FREE_TRIAL_DURATION_MS;
}

async function withinSubmissionRateLimit(): Promise<boolean> {
  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-real-ip")?.trim()
    || requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!ip || !serviceKey) throw new Error("Submission rate limiting is not configured.");

  const fingerprint = createHmac("sha256", serviceKey).update(ip).digest("hex");
  const { data, error } = await getSupabaseAdmin().rpc("allow_deal_submission", {
    p_client_fingerprint: fingerprint,
  });
  if (error) throw new Error(`Submission rate-limit check failed: ${error.message}`);
  return data === true;
}

export async function submitSubmission(rawInput: unknown): Promise<{
  success: boolean;
  id?: string;
  title?: string;
  errorCode?:
    | "invalid"
    | "consent_required"
    | "temporarily_unavailable"
    | "rate_limited"
    | "save_failed"
    | "import_unavailable"
    | "listing_not_found"
    | "billing_required";
}> {
  const record = rawInput !== null && typeof rawInput === "object" && !Array.isArray(rawInput)
    ? rawInput as Record<string, unknown>
    : {};
  // Honeypot for unsophisticated automated form submissions.
  if (typeof record.website === "string" && record.website.trim()) return { success: true };
  if (record.consent !== true) return { success: false, errorCode: "consent_required" };

  const productUrl = typeof record.productUrl === "string"
    ? canonicalEtsyUrl(record.productUrl, "listing")
    : null;
  const couponCode = typeof record.couponCode === "string" ? record.couponCode.trim().slice(0, 80) : "";
  const expiresAt = typeof record.expiresAt === "string" ? record.expiresAt.trim() : "";
  if (
    !productUrl ||
    (record.couponCode !== undefined && typeof record.couponCode !== "string") ||
    (record.expiresAt !== undefined && typeof record.expiresAt !== "string")
  ) {
    return { success: false, errorCode: "invalid" };
  }

  if (!isEtsyApiConfigured()) return { success: false, errorCode: "import_unavailable" };
  if (process.env.NODE_ENV === "production" && !isSupabaseConfigured()) {
    return { success: false, errorCode: "temporarily_unavailable" };
  }

  if (isSupabaseConfigured()) {
    try {
      if (!(await withinSubmissionRateLimit())) return { success: false, errorCode: "rate_limited" };
    } catch (error) {
      console.error("Submission rate-limit check failed:", error);
      return { success: false, errorCode: "temporarily_unavailable" };
    }
  }

  try {
    const imported = await importEtsyListing(productUrl);
    if (!imported.ok) {
      return {
        success: false,
        errorCode: imported.reason === "not_found" ? "listing_not_found" : "import_unavailable",
      };
    }

    if (await isSellerTrialExpired(imported.listing.sellerShopUrl)) {
      return { success: false, errorCode: "billing_required" };
    }

    const validation = validateSubmission({
      ...imported.listing,
      couponCode: couponCode || undefined,
      expiresAt: expiresAt || undefined,
    });
    if (!validation.ok) return { success: false, errorCode: "invalid" };

    const submission = createSubmission(validation.data);
    await getSubmissionStore().create(submission);
    revalidatePath("/admin/submissions");
    return { success: true, id: submission.id, title: submission.title };
  } catch (error) {
    console.error("Failed to create imported submission:", error);
    return { success: false, errorCode: "temporarily_unavailable" };
  }
}

export async function getAllSubmissions(): Promise<Submission[]> {
  await assertAdmin();
  try {
    return [...(await getSubmissionStore().getAll())];
  } catch (error) {
    console.error("Failed to fetch submissions:", error);
    throw new Error("Unable to load submissions.");
  }
}

export async function getSubmissionById(id: string): Promise<Submission | null> {
  await assertAdmin();
  try {
    return (await getSubmissionStore().getById(id)) ?? null;
  } catch (error) {
    console.error("Failed to fetch submission:", error);
    throw new Error("Unable to load this submission.");
  }
}

function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80) || "etsy-deal";
}

function shopLabel(shopUrl: string): string {
  const url = new URL(shopUrl);
  const parts = url.pathname.split("/").filter(Boolean);
  return parts.length > 1 ? decodeURIComponent(parts[1]) : "Etsy seller";
}

async function publishSubmission(submission: Submission): Promise<Product> {
  const checked = validateSubmission({
    sellerShopUrl: submission.sellerShopUrl,
    productUrl: submission.productUrl,
    title: submission.title,
    imageUrl: submission.imageUrl,
    originalPrice: submission.originalPrice,
    discountedPrice: submission.discountedPrice,
    couponCode: submission.couponCode,
    expiresAt: submission.expiresAt,
    category: submission.category,
    description: submission.description,
  });
  if (!checked.ok) throw new Error("Submission contains invalid listing details.");

  const data = checked.data;
  const store = getProductStore();
  const discountPercent = Math.round(((data.originalPrice - data.discountedPrice) / data.originalPrice) * 100);
  const duplicate = await store.findDuplicate(data.productUrl);
  const now = new Date().toISOString();

  if (duplicate) {
    const updated: Product = {
      ...duplicate,
      title: data.title,
      description: data.description,
      image: data.imageUrl ?? "",
      shop: shopLabel(data.sellerShopUrl),
      etsyUrl: data.productUrl,
      source: "submission",
      sourceId: submission.id,
      category: productCategoryValidate(data.category),
      price: data.originalPrice,
      discountedPrice: data.discountedPrice,
      currency: "USD",
      discountPercent,
      couponCode: data.couponCode ?? "",
      expiresAt: data.expiresAt,
      publishedAt: now,
      status: "approved",
      updatedAt: now,
    };
    await store.update(updated);
    return updated;
  }

  const baseSlug = slugify(data.title);
  let slug = baseSlug;
  for (let suffix = 2; await store.getBySlug(slug); suffix += 1) {
    slug = `${baseSlug}-${suffix}`;
  }

  const product: Product = {
    id: crypto.randomUUID(),
    title: data.title,
    slug,
    description: data.description,
    image: data.imageUrl ?? "",
    shop: shopLabel(data.sellerShopUrl),
    etsyUrl: data.productUrl,
    source: "submission",
    sourceId: submission.id,
    category: productCategoryValidate(data.category),
    price: data.originalPrice,
    discountedPrice: data.discountedPrice,
    currency: "USD",
    discountPercent,
    couponCode: data.couponCode ?? "",
    expiresAt: data.expiresAt,
    publishedAt: now,
    status: "approved",
    createdAt: now,
  };
  await store.create(product);
  return product;
}

export async function approveSubmission(id: string): Promise<{ success: boolean; error?: string }> {
  await assertAdmin();
  try {
    const submissionStore = getSubmissionStore();
    const submission = await submissionStore.getById(id);
    if (!submission || submission.status !== "pending") {
      return { success: false, error: "This submission is no longer pending." };
    }
    if (await isSellerTrialExpired(submission.sellerShopUrl)) {
      return { success: false, error: "The seller's free trial has ended; per-listing billing is not configured yet." };
    }

    const product = await publishSubmission(submission);
    await submissionStore.updateStatus(id, "approved");
    revalidatePath("/");
    revalidatePath("/search");
    revalidatePath("/admin/submissions");
    revalidatePath(`/product/${product.slug}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to approve submission:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unable to approve this submission.",
    };
  }
}

export async function rejectSubmission(id: string): Promise<boolean> {
  await assertAdmin();
  try {
    await getSubmissionStore().updateStatus(id, "rejected");
    revalidatePath("/admin/submissions");
    return true;
  } catch (error) {
    console.error("Failed to reject submission:", error);
    return false;
  }
}
