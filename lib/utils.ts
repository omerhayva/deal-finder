import { Product } from "./types";

export const formatPrice = (value: number) => `$${value.toFixed(2)}`;

export const formatDate = (value?: string) => {
  if (!value) return "No expiry";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T00:00:00`));
};

export const searchProducts = (items: Product[], query: string) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return items;
  return items.filter((product) => [product.title, product.shop, product.category, product.couponCode].some((field) => field.toLowerCase().includes(normalized)));
};
