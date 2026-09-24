// Canonical mock-data entry point.
// All product data lives in lib/types.ts; this file re-exports it
// so existing imports from @/lib/mock-data keep working.
export type { ProductCategory, Product } from "./types";
export { products, getProductBySlug, getProductById } from "./types";
