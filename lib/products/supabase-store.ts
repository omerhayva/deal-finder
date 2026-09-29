import { getSupabaseAdmin } from "@/lib/supabase-admin";
import type { Product, ProductStatus } from '@/lib/types';
import { productCategoryValidate } from '@/lib/types';

function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.search = '';
    parsed.hash = '';
    parsed.pathname = parsed.pathname.replace(/\/+$/, '');
    return parsed.toString().toLowerCase();
  } catch {
    return url.toLowerCase().trim();
  }
}

function mapRowToProduct(row: Record<string, unknown>): Product {
  return {
    id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    description: row.description ? String(row.description) : undefined,
    image: row.image_url ? String(row.image_url) : '',
    shop: String(row.shop_name),
    etsyUrl: String(row.product_url),
    source: String(row.source),
    sourceId: row.source_id ? String(row.source_id) : undefined,
    category: productCategoryValidate(String(row.category)),
    price: Number(row.original_price),
    discountedPrice: Number(row.discounted_price),
    currency: String(row.currency),
    discountPercent: Number(row.discount_percent),
    couponCode: row.coupon_code ? String(row.coupon_code) : '',
    expiresAt: row.expires_at ? new Date(String(row.expires_at)).toISOString() : undefined,
    verifiedAt: row.verified_at ? new Date(String(row.verified_at)).toISOString() : new Date().toISOString(),
    status: row.status as ProductStatus,
    createdAt: new Date(String(row.created_at)).toISOString(),
    updatedAt: row.updated_at ? new Date(String(row.updated_at)).toISOString() : undefined,
  };
}

export class SupabaseProductStore {
  async create(product: Product): Promise<void> {
    const { error } = await getSupabaseAdmin().from('products').insert({
      id: product.id,
      title: product.title,
      slug: product.slug,
      description: product.description,
      image_url: product.image,
      shop_name: product.shop,
      product_url: product.etsyUrl,
      source: product.source,
      source_id: product.sourceId,
      category: product.category,
      original_price: product.price,
      discounted_price: product.discountedPrice,
      currency: product.currency,
      discount_percent: product.discountPercent,
      coupon_code: product.couponCode,
      expires_at: product.expiresAt ? new Date(product.expiresAt) : null,
      verified_at: product.verifiedAt ? new Date(product.verifiedAt) : null,
      status: product.status,
      created_at: product.createdAt ? new Date(product.createdAt) : new Date().toISOString(),
    });

    if (error) {
      throw new Error(`Supabase product insert failed: ${error.message}`);
    }
  }

  async getById(id: string): Promise<Product | null> {
    const { data, error } = await getSupabaseAdmin()
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Supabase getById failed: ${error.message}`);
    }
    return mapRowToProduct(data);
  }

  async getBySlug(slug: string): Promise<Product | null> {
    const { data, error } = await getSupabaseAdmin()
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Supabase getBySlug failed: ${error.message}`);
    }
    return mapRowToProduct(data);
  }

  async getAll(): Promise<Product[]> {
    const { data, error } = await getSupabaseAdmin()
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Supabase getAll failed: ${error.message}`);
    }
    return (data || []).map(mapRowToProduct);
  }

  async getApproved(): Promise<Product[]> {
    const { data, error } = await getSupabaseAdmin()
      .from('products')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Supabase getApproved failed: ${error.message}`);
    }

    const now = new Date();
    return (data || [])
      .filter((row) => {
        if (!row.expires_at) return true;
        return new Date(String(row.expires_at)) > now;
      })
      .map(mapRowToProduct);
  }

  async updateStatus(id: string, status: ProductStatus): Promise<void> {
    const { error } = await getSupabaseAdmin()
      .from('products')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      throw new Error(`Supabase updateStatus failed: ${error.message}`);
    }
  }

  async update(product: Product): Promise<void> {
    const { error } = await getSupabaseAdmin()
      .from('products')
      .update({
        title: product.title,
        description: product.description,
        image_url: product.image,
        original_price: product.price,
        discounted_price: product.discountedPrice,
        discount_percent: product.discountPercent,
        coupon_code: product.couponCode,
        expires_at: product.expiresAt ? new Date(product.expiresAt) : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', product.id);

    if (error) {
      throw new Error(`Supabase product update failed: ${error.message}`);
    }
  }

  async findDuplicate(productUrl: string): Promise<Product | null> {
    const { data, error } = await getSupabaseAdmin()
      .from('products')
      .select('*');

    if (error) {
      throw new Error(`Supabase findDuplicate failed: ${error.message}`);
    }

    if (!data) return null;
    const normalized = normalizeUrl(productUrl);
    for (const row of data) {
      if (normalizeUrl(String(row.product_url || '')) === normalized) {
        return mapRowToProduct(row);
      }
    }
    return null;
  }
}
