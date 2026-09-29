import type { Product, ProductStatus } from './types';
import { products as mockProducts } from '@/lib/types';

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

// ---------------------------------------------------------------------------
// Development / in-memory fallback
// Converts the existing mock products to the canonical Product shape.
// ---------------------------------------------------------------------------

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

function convertMockProduct(mp: typeof mockProducts[number]): Product {
  return {
    id: mp.id,
    title: mp.title,
    slug: mp.slug,
    description: undefined,
    image: mp.image,
    shop: mp.shop,
    etsyUrl: mp.etsyUrl,
    source: 'mock',
    category: mp.category,
    price: mp.price,
    discountedPrice: mp.discountedPrice,
    currency: 'USD',
    discountPercent: mp.discountPercent,
    couponCode: mp.couponCode,
    expiresAt: mp.expiresAt,
    verifiedAt: mp.verifiedAt,
    status: 'approved' as ProductStatus,
    createdAt: mp.verifiedAt,
  };
}

export class InMemoryProductStore implements ProductRepository {
  private products: Product[] = [];

  constructor() {
    // Lazy-initialized from mock data on first use.
  }

  private ensureMockDataLoaded(): void {
    if (this.products.length > 0) return;
    this.products = mockProducts.map(convertMockProduct);
  }

  async create(product: Product): Promise<void> {
    this.ensureMockDataLoaded();
    const existing = this.products.find((p) => p.id === product.id);
    if (existing) {
      const idx = this.products.indexOf(existing);
      this.products[idx] = product;
    } else {
      this.products.push(product);
    }
  }

  async getById(id: string): Promise<Product | null> {
    this.ensureMockDataLoaded();
    return this.products.find((p) => p.id === id) ?? null;
  }

  async getBySlug(slug: string): Promise<Product | null> {
    this.ensureMockDataLoaded();
    return this.products.find((p) => p.slug === slug) ?? null;
  }

  async getAll(): Promise<Product[]> {
    this.ensureMockDataLoaded();
    return [...this.products];
  }

  async getApproved(): Promise<Product[]> {
    this.ensureMockDataLoaded();
    const now = new Date();
    return this.products
      .filter((p) => p.status === 'approved')
      .filter((p) => {
        if (!p.expiresAt) return true;
        return new Date(p.expiresAt) > now;
      })
      .sort((a, b) => new Date(b.createdAt ?? '').getTime() - new Date(a.createdAt ?? '').getTime());
  }

  async updateStatus(id: string, status: ProductStatus): Promise<void> {
    this.ensureMockDataLoaded();
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx >= 0) {
      this.products[idx] = { ...this.products[idx], status };
    }
  }

  async update(product: Product): Promise<void> {
    this.ensureMockDataLoaded();
    const idx = this.products.findIndex((p) => p.id === product.id);
    if (idx >= 0) {
      this.products[idx] = product;
    } else {
      this.products.push(product);
    }
  }

  async findDuplicate(productUrl: string): Promise<Product | null> {
    this.ensureMockDataLoaded();
    const normalized = normalizeUrl(productUrl);
    return this.products.find(
      (p) => normalizeUrl(p.etsyUrl) === normalized
    ) ?? null;
  }
}

export const devProductStore = new InMemoryProductStore();
