import "server-only";

import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { productCategoryValidate } from "@/lib/types";
import type { Product, ProductStatus } from "./types";
import { normalizeProductUrl, type ProductRepository } from "./store";

function dateOnly(value: unknown): string | undefined {
  if (!value) return undefined;
  const raw = String(value);
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString().slice(0, 10);
}

function isoDate(value: unknown): string | undefined {
  if (!value) return undefined;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function mapRowToProduct(row: Record<string, unknown>): Product {
  return {
    id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    description: row.description ? String(row.description) : undefined,
    image: row.image_url ? String(row.image_url) : "",
    shop: String(row.shop_name),
    etsyUrl: String(row.product_url),
    source: row.source ? String(row.source) : undefined,
    sourceId: row.source_id ? String(row.source_id) : undefined,
    category: productCategoryValidate(String(row.category)),
    price: Number(row.original_price),
    discountedPrice: Number(row.discounted_price),
    currency: row.currency ? String(row.currency) : "USD",
    discountPercent: Number(row.discount_percent),
    couponCode: row.coupon_code ? String(row.coupon_code) : "",
    expiresAt: dateOnly(row.expires_at),
    publishedAt: isoDate(row.published_at) ?? undefined,
    status: row.status as ProductStatus,
    createdAt: isoDate(row.created_at),
    updatedAt: isoDate(row.updated_at),
  };
}

function isNotExpired(row: Record<string, unknown>, now = Date.now()): boolean {
  const expiry = dateOnly(row.expires_at);
  if (!expiry) return !row.expires_at;
  return new Date(`${expiry}T23:59:59.999Z`).getTime() >= now;
}

export class SupabaseProductStore implements ProductRepository {
  async create(product: Product): Promise<void> {
    const { error } = await getSupabaseAdmin().from("products").insert({
      id: product.id,
      title: product.title,
      slug: product.slug,
      description: product.description ?? null,
      image_url: product.image || null,
      shop_name: product.shop,
      product_url: product.etsyUrl,
      source: product.source ?? "manual",
      source_id: product.sourceId ?? null,
      category: product.category,
      original_price: product.price,
      discounted_price: product.discountedPrice,
      currency: product.currency ?? "USD",
      discount_percent: product.discountPercent,
      coupon_code: product.couponCode || null,
      expires_at: product.expiresAt?.slice(0, 10) ?? null,
      published_at: product.publishedAt ?? null,
      status: product.status ?? "pending",
      created_at: product.createdAt ?? new Date().toISOString(),
    });

    if (error) throw new Error(`Supabase product insert failed: ${error.message}`);
  }

  async getById(id: string): Promise<Product | null> {
    const { data, error } = await getSupabaseAdmin()
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(`Supabase getById failed: ${error.message}`);
    return data ? mapRowToProduct(data as Record<string, unknown>) : null;
  }

  async getBySlug(slug: string): Promise<Product | null> {
    const { data, error } = await getSupabaseAdmin()
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw new Error(`Supabase getBySlug failed: ${error.message}`);
    return data ? mapRowToProduct(data as Record<string, unknown>) : null;
  }

  async getAll(): Promise<Product[]> {
    const { data, error } = await getSupabaseAdmin()
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(`Supabase getAll failed: ${error.message}`);
    return (data ?? []).map((row) => mapRowToProduct(row as Record<string, unknown>));
  }

  async getApproved(): Promise<Product[]> {
    const { data, error } = await getSupabaseAdmin()
      .from("products")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) throw new Error(`Supabase getApproved failed: ${error.message}`);
    return (data ?? [])
      .filter((row) => isNotExpired(row as Record<string, unknown>))
      .map((row) => mapRowToProduct(row as Record<string, unknown>));
  }

  async updateStatus(id: string, status: ProductStatus): Promise<void> {
    const { data, error } = await getSupabaseAdmin()
      .from("products")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) throw new Error(`Supabase updateStatus failed: ${error.message}`);
    if (!data) throw new Error("Product not found.");
  }

  async update(product: Product): Promise<void> {
    const { data, error } = await getSupabaseAdmin()
      .from("products")
      .update({
        title: product.title,
        description: product.description ?? null,
        image_url: product.image || null,
        shop_name: product.shop,
        product_url: product.etsyUrl,
        category: product.category,
        original_price: product.price,
        discounted_price: product.discountedPrice,
        currency: product.currency ?? "USD",
        discount_percent: product.discountPercent,
        coupon_code: product.couponCode || null,
        expires_at: product.expiresAt?.slice(0, 10) ?? null,
        published_at: product.publishedAt ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", product.id)
      .select("id")
      .maybeSingle();

    if (error) throw new Error(`Supabase product update failed: ${error.message}`);
    if (!data) throw new Error("Product not found.");
  }

  async findDuplicate(productUrl: string): Promise<Product | null> {
    const normalized = normalizeProductUrl(productUrl);
    const { data, error } = await getSupabaseAdmin()
      .from("products")
      .select("*");

    if (error) throw new Error(`Supabase findDuplicate failed: ${error.message}`);
    const duplicate = (data ?? []).find((row) => normalizeProductUrl(String(row.product_url ?? "")) === normalized);
    return duplicate ? mapRowToProduct(duplicate as Record<string, unknown>) : null;
  }
}
