"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/admin/auth";
import { canonicalEtsyUrl } from "@/lib/etsy";
import { getProductStore, isSupabaseConfigured } from "@/lib/products/get-store";
import type { Product, ProductStatus } from "@/lib/products/types";
import { productCategoryValidate, PRODUCT_CATEGORIES } from "@/lib/types";

export type CreateProductInput = {
  title: string;
  description?: string;
  imageUrl?: string;
  shopName: string;
  productUrl: string;
  category: string;
  originalPrice: number;
  discountedPrice: number;
  currency?: string;
  couponCode?: string;
  expiresAt?: string;
  source?: string;
  sourceId?: string;
};

function requireProductionStorage(): void {
  if (process.env.NODE_ENV === "production" && !isSupabaseConfigured()) {
    throw new Error("Supabase must be configured before managing production products.");
  }
}

function slugify(title: string): string {
  return title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80) || "etsy-deal";
}

function validImageUrl(value?: string): boolean {
  if (!value?.trim()) return true;
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" && !url.username && !url.password && value.length <= 2048;
  } catch {
    return false;
  }
}

function validExpiryDate(value?: string): boolean {
  if (!value) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export async function createProduct(input: CreateProductInput): Promise<{
  success: boolean;
  product?: Product;
  error?: string;
}> {
  await assertAdmin();
  try {
    requireProductionStorage();
    const title = typeof input?.title === "string" ? input.title.trim() : "";
    const shopName = typeof input?.shopName === "string" ? input.shopName.trim() : "";
    const productUrl = typeof input?.productUrl === "string"
      ? canonicalEtsyUrl(input.productUrl, "listing")
      : null;
    const originalPrice = Number(input?.originalPrice);
    const discountedPrice = Number(input?.discountedPrice);
    const category = typeof input?.category === "string" ? input.category : "";

    if (!title || title.length > 160) return { success: false, error: "Enter a title between 1 and 160 characters." };
    if (!shopName || shopName.length > 120) return { success: false, error: "Enter a valid shop name." };
    if (!productUrl) return { success: false, error: "Enter a valid Etsy listing URL." };
    if (!Number.isFinite(originalPrice) || originalPrice <= 0 || originalPrice > 1_000_000) {
      return { success: false, error: "Original price must be greater than zero." };
    }
    if (!Number.isFinite(discountedPrice) || discountedPrice <= 0 || discountedPrice > originalPrice) {
      return { success: false, error: "Sale price must be positive and no higher than the original price." };
    }
    if (![...PRODUCT_CATEGORIES, "General"].includes(category as (typeof PRODUCT_CATEGORIES)[number] | "General")) {
      return { success: false, error: "Choose a valid category." };
    }
    if (!validImageUrl(input.imageUrl)) return { success: false, error: "Image URL must use HTTPS." };
    if (!validExpiryDate(input.expiresAt)) return { success: false, error: "Enter a valid expiration date." };

    const store = getProductStore();
    const duplicate = await store.findDuplicate(productUrl);
    if (duplicate) return { success: false, error: "This listing is already in the catalogue." };

    const discountPercent = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
    const baseSlug = slugify(title);
    let slug = baseSlug;
    for (let suffix = 2; await store.getBySlug(slug); suffix += 1) {
      slug = `${baseSlug}-${suffix}`;
    }

    const now = new Date().toISOString();
    const product: Product = {
      id: crypto.randomUUID(),
      title,
      slug,
      description: input.description?.trim().slice(0, 2000) || undefined,
      image: input.imageUrl?.trim() || "",
      shop: shopName,
      etsyUrl: productUrl,
      source: "manual",
      sourceId: input.sourceId?.slice(0, 120),
      category: productCategoryValidate(category),
      price: originalPrice,
      discountedPrice,
      currency: "USD",
      discountPercent,
      couponCode: input.couponCode?.trim().slice(0, 80) || "",
      expiresAt: input.expiresAt || undefined,
      publishedAt: now,
      status: "approved",
      createdAt: now,
    };

    await store.create(product);
    revalidatePath("/");
    revalidatePath("/search");
    revalidatePath(`/product/${slug}`);
    return { success: true, product };
  } catch (error) {
    console.error("createProduct error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Could not create the product.",
    };
  }
}

export async function getAllProducts(): Promise<Product[]> {
  await assertAdmin();
  return getProductStore().getAll();
}

export async function getProductById(id: string): Promise<Product | null> {
  await assertAdmin();
  return getProductStore().getById(id);
}

export async function updateProductStatus(id: string, status: ProductStatus): Promise<boolean> {
  await assertAdmin();
  try {
    requireProductionStorage();
    if (!["approved", "rejected", "expired", "pending"].includes(status)) return false;
    await getProductStore().updateStatus(id, status);
    revalidatePath("/");
    revalidatePath("/search");
    revalidatePath(`/admin/products`);
    return true;
  } catch (error) {
    console.error("Product status update failed:", error);
    return false;
  }
}
