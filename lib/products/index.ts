import { getProductStore } from './get-store';
import type { Product } from './types';

export async function getAllProducts(): Promise<Product[]> {
  const store = getProductStore();
  return store.getAll();
}

export async function getProducts(): Promise<Product[]> {
  const store = getProductStore();
  return store.getAll();
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const store = getProductStore();
  return store.getBySlug(slug);
}

export async function getProductById(id: string): Promise<Product | null> {
  const store = getProductStore();
  return store.getById(id);
}

export async function getApprovedProducts(): Promise<Product[]> {
  const store = getProductStore();
  return store.getApproved();
}
