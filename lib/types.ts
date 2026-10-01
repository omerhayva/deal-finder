export type ProductCategory =
  | "Wedding"
  | "Home Decor"
  | "Digital Products"
  | "Gifts"
  | "Jewelry"
  | "Clothing"
  | "Printable"
  | "Wall Art"
  | "General";

export const PRODUCT_CATEGORIES: readonly Exclude<ProductCategory, "General">[] = [
  "Wedding",
  "Home Decor",
  "Digital Products",
  "Gifts",
  "Jewelry",
  "Clothing",
  "Printable",
  "Wall Art",
];

export function productCategoryValidate(value: string): ProductCategory {
  return [...PRODUCT_CATEGORIES, "General"].includes(value as ProductCategory)
    ? (value as ProductCategory)
    : "General";
}

export type ProductStatus = "pending" | "approved" | "rejected" | "expired";

export type Product = {
  id: string;
  shop: string;
  title: string;
  slug: string;
  image: string;
  etsyUrl: string;
  price: number;
  discountedPrice: number;
  category: ProductCategory;
  couponCode: string;
  discountPercent: number;
  expiresAt?: string;
  publishedAt?: string;
  featured?: boolean;
  featuredUntil?: string;
  description?: string;
  source?: string;
  sourceId?: string;
  currency?: string;
  status?: ProductStatus;
  createdAt?: string;
  updatedAt?: string;
};
