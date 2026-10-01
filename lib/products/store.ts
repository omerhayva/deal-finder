import type { Product, ProductStatus } from "./types";

export interface ProductRepository {
  create(product: Product): Promise<void>;
  getById(id: string): Promise<Product | null>;
  getBySlug(slug: string): Promise<Product | null>;
  getAll(): Promise<Product[]>;
  getApproved(): Promise<Product[]>;
  updateStatus(id: string, status: ProductStatus): Promise<void>;
  update(product: Product): Promise<void>;
  findDuplicate(productUrl: string): Promise<Product | null>;
}

export function normalizeProductUrl(value: string): string {
  try {
    const url = new URL(value);
    url.hash = "";
    url.search = "";
    url.pathname = url.pathname.replace(/\/+$/, "");
    return url.toString().toLowerCase();
  } catch {
    return value.trim().toLowerCase();
  }
}

function isCurrent(product: Product, now = Date.now()): boolean {
  if (product.status !== "approved") return false;
  if (!product.expiresAt) return true;
  const expiresAt = /^\d{4}-\d{2}-\d{2}$/.test(product.expiresAt)
    ? new Date(`${product.expiresAt}T23:59:59.999Z`).getTime()
    : new Date(product.expiresAt).getTime();
  return Number.isFinite(expiresAt) && expiresAt >= now;
}

/** Volatile store used only for local development when Supabase is not configured. */
export class InMemoryProductStore implements ProductRepository {
  private products: Product[] = [];

  async create(product: Product): Promise<void> {
    const existingIndex = this.products.findIndex((item) => item.id === product.id);
    if (existingIndex >= 0) this.products[existingIndex] = product;
    else this.products.push(product);
  }

  async getById(id: string): Promise<Product | null> {
    return this.products.find((product) => product.id === id) ?? null;
  }

  async getBySlug(slug: string): Promise<Product | null> {
    return this.products.find((product) => product.slug === slug) ?? null;
  }

  async getAll(): Promise<Product[]> {
    return [...this.products].sort((a, b) =>
      (b.createdAt ?? "").localeCompare(a.createdAt ?? ""),
    );
  }

  async getApproved(): Promise<Product[]> {
    const now = Date.now();
    return (await this.getAll()).filter((product) => isCurrent(product, now));
  }

  async updateStatus(id: string, status: ProductStatus): Promise<void> {
    const index = this.products.findIndex((product) => product.id === id);
    if (index < 0) throw new Error("Product not found.");
    this.products[index] = { ...this.products[index], status, updatedAt: new Date().toISOString() };
  }

  async update(product: Product): Promise<void> {
    const index = this.products.findIndex((item) => item.id === product.id);
    if (index < 0) throw new Error("Product not found.");
    this.products[index] = product;
  }

  async findDuplicate(productUrl: string): Promise<Product | null> {
    const normalized = normalizeProductUrl(productUrl);
    return this.products.find((product) => normalizeProductUrl(product.etsyUrl) === normalized) ?? null;
  }
}

export const devProductStore = new InMemoryProductStore();
