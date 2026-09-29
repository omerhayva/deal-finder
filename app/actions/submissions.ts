"use server";

import { revalidatePath } from "next/cache";
import { getSubmissionStore } from "@/lib/submissions/get-store";
import { SupabaseSubmissionStore } from "@/lib/submissions/supabase-store";
import type { Submission } from "@/lib/submissions/types";
import { getProductStore } from "@/lib/products/get-store";
import type { Product } from "@/lib/products/types";
import { productCategoryValidate } from "@/lib/types";

export async function submitSubmission(
  submission: Submission
): Promise<{ success: boolean; error?: string }> {
  try {
    const store = getSubmissionStore();
    await store.create(submission);
    revalidatePath("/admin/submissions");

    return { success: true };
  } catch (error) {
    console.error("Failed to create submission:", error);

    return {
      success: false,
      error: error instanceof Error
        ? error.message
        : "Submission could not be saved.",
    };
  }
}

export async function getAllSubmissions(): Promise<Submission[]> {
  try {
    const store = getSubmissionStore();
    return [...(await store.getAll())];
  } catch (error) {
    console.error("Failed to fetch submissions:", error);
    return [];
  }
}

export async function getSubmissionById(
  id: string
): Promise<Submission | null> {
  try {
    const store = getSubmissionStore();
    return (await store.getById(id)) ?? null;
  } catch (error) {
    console.error("Failed to fetch submission:", error);
    return null;
  }
}

export async function approveSubmission(id: string): Promise<boolean> {
  try {
    const store = getSubmissionStore();
    await store.updateStatus(id, "approved");
    revalidatePath("/admin/submissions");
    return true;
  } catch (error) {
    console.error("Failed to approve submission:", error);
    return false;
  }
}

export async function rejectSubmission(id: string): Promise<boolean> {
  try {
    const store = getSubmissionStore();
    await store.updateStatus(id, "rejected");
    revalidatePath("/admin/submissions");
    return true;
  } catch (error) {
    console.error("Failed to reject submission:", error);
    return false;
  }
}

export async function getStorageMode(): Promise<"supabase" | "memory"> {
  const store = getSubmissionStore();
  return store instanceof SupabaseSubmissionStore ? "supabase" : "memory";
}

// ---------------------------------------------------------------------------
// Approve submission AND create / update the corresponding product
// ---------------------------------------------------------------------------

function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
  return base || "product";
}

function deriveDiscountPercent(originalPrice: number, discountedPrice: number): number {
  const raw = ((originalPrice - discountedPrice) / originalPrice) * 100;
  return Math.round(raw);
}

export async function createProductFromSubmission(
  submission: Submission
): Promise<{ product?: Product; error?: string }> {
  try {
    const productStore = getProductStore();

    // Validate prices
    if (!submission.productUrl) {
      return { error: "Ürün URL\'i yok." };
    }
    if (submission.originalPrice <= 0 || submission.discountedPrice <= 0) {
      return { error: "Fiyatlar geçersiz." };
    }
    if (submission.discountedPrice > submission.originalPrice) {
      return { error: "İndirimli fiyat, normal fiyatın üzerinde." };
    }

    const discountPercent = deriveDiscountPercent(
      submission.originalPrice,
      submission.discountedPrice
    );

    // Duplicate check
    const duplicate = await productStore.findDuplicate(submission.productUrl);
    if (duplicate) {
      // Update existing product with fresh data
      const updated: Product = {
        ...duplicate,
        title: submission.title || duplicate.title,
        description: submission.description || duplicate.description,
        etsyUrl: submission.productUrl || duplicate.etsyUrl,
        price: submission.originalPrice,
        discountedPrice: submission.discountedPrice,
        discountPercent,
        couponCode: submission.couponCode || duplicate.couponCode,
        expiresAt: submission.expiresAt || duplicate.expiresAt,
        updatedAt: new Date().toISOString(),
      };
      await productStore.update(updated);
      return { product: updated };
    }

    // Generate unique slug
    const baseSlug = generateSlug(submission.title || "Ürün");
    let slug = baseSlug;
    let counter = 1;
    while (await productStore.getBySlug(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const now = new Date().toISOString();
    const product: Product = {
      id: crypto.randomUUID(),
      title: submission.title || "Ürün",
      slug,
      description: submission.description,
      image: submission.imageUrl || "",
      shop: new URL(submission.productUrl).hostname.replace("www.", ""),
      etsyUrl: submission.productUrl,
      source: "submission",
      sourceId: submission.id,
      category: productCategoryValidate(submission.category || "General"),
      price: submission.originalPrice,
      discountedPrice: submission.discountedPrice,
      currency: "USD",
      discountPercent,
      couponCode: submission.couponCode || "",
      expiresAt: submission.expiresAt,
      verifiedAt: now,
      status: "approved",
      createdAt: now,
    };

    await productStore.create(product);
    return { product };
  } catch (error) {
    console.error("createProductFromSubmission error:", error);
    return {
      error: error instanceof Error ? error.message : " Ürün oluşturulamadı.",
    };
  }
}
