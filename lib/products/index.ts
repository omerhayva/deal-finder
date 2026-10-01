import { getProductStore } from "./get-store";
import type { Product } from "./types";

function isPublicProduct(product: Product): boolean {
  if (product.status !== "approved") return false;
  if (!product.expiresAt) return true;

  const expiry = /^\d{4}-\d{2}-\d{2}$/.test(product.expiresAt)
    ? new Date(`${product.expiresAt}T23:59:59.999Z`).getTime()
    : new Date(product.expiresAt).getTime();
  return Number.isFinite(expiry) && expiry >= Date.now();
}

export async function getAllProducts(): Promise<Product[]> {
  return getApprovedProducts();
}

export async function getProducts(): Promise<Product[]> {
  return getApprovedProducts();
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const product = await getProductStore().getBySlug(slug);
  return product && isPublicProduct(product) ? product : null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const product = await getProductStore().getById(id);
  return product && isPublicProduct(product) ? product : null;
}

export async function getApprovedProducts(): Promise<Product[]> {
  return getProductStore().getApproved();
}
