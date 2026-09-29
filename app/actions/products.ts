"use server";

import { revalidatePath } from "next/cache";
import { getProductStore } from "@/lib/products/get-store";
import type { Product, ProductStatus } from "@/lib/products/types";
import { productCategoryValidate } from "@/lib/types";

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

export async function createProduct(input: CreateProductInput): Promise<{
  success: boolean;
  product?: Product;
  error?: string;
}> {
  try {
    if (!input.title?.trim()) {
      return { success: false, error: "Başlık zorunludur." };
    }
    if (!input.shopName?.trim()) {
      return { success: false, error: "Mağaza adı zorunludur." };
    }
    if (!input.productUrl?.trim()) {
      return { success: false, error: "Ürün URL'i zorunludur." };
    }
    if (input.originalPrice <= 0) {
      return { success: false, error: "Normal fiyat 0'dan büyük olmalıdır." };
    }
    if (input.discountedPrice <= 0) {
      return { success: false, error: "İndirimli fiyat 0'dan büyük olmalıdır." };
    }
    if (input.discountedPrice > input.originalPrice) {
      return { success: false, error: "İndirimli fiyat, normal fiyatın üzerinde olamaz." };
    }

    const store = getProductStore();

    // Duplicate check by normalized product URL
    const duplicate = await store.findDuplicate(input.productUrl);
    if (duplicate) {
      return { success: false, error: "Bu ürün zaten katalogda mevcut." };
    }

    const discountPercent = deriveDiscountPercent(input.originalPrice, input.discountedPrice);
    const baseSlug = generateSlug(input.title);

    // Ensure unique slug
    let slug = baseSlug;
    let counter = 1;
    while (await store.getBySlug(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const now = new Date().toISOString();
    const product: Product = {
      id: crypto.randomUUID(),
      title: input.title.trim(),
      slug,
      description: input.description?.trim() || undefined,
      image: input.imageUrl?.trim() || "",
      shop: input.shopName.trim(),
      etsyUrl: input.productUrl.trim(),
      source: input.source || "manual",
      sourceId: input.sourceId,
      category: productCategoryValidate(input.category),
      price: input.originalPrice,
      discountedPrice: input.discountedPrice,
      currency: input.currency || "USD",
      discountPercent,
      couponCode: input.couponCode?.trim() || "",
      expiresAt: input.expiresAt,
      verifiedAt: now,
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
      error: error instanceof Error ? error.message : "Ürün oluşturulamadı.",
    };
  }
}

export async function getAllProducts(): Promise<Product[]> {
  const store = getProductStore();
  return store.getAll();
}

export async function getProductById(id: string): Promise<Product | null> {
  const store = getProductStore();
  return store.getById(id);
}

export async function updateProductStatus(id: string, status: ProductStatus): Promise<boolean> {
  try {
    const store = getProductStore();
    await store.updateStatus(id, status);
    revalidatePath("/");
    revalidatePath("/search");
    return true;
  } catch {
    return false;
  }
}
