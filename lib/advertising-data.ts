import { Product } from "./types";

export type AdvertisingSlotStatus = "occupied" | "available";

export type AdvertisingSlot = {
  id: string;
  position: number;
  status: AdvertisingSlotStatus;
  productId?: string;
  sellerName?: string;
  startDate?: string;
  endDate?: string;
  pricePerDay: number;
};

export const advertisingSlots: AdvertisingSlot[] = [
  { id: "slot-01", position: 1, status: "occupied", productId: "p1", sellerName: "Paper & Pine Studio", startDate: "2026-09-20", endDate: "2026-10-04", pricePerDay: 1 },
  { id: "slot-02", position: 2, status: "occupied", productId: "p4", sellerName: "Little Good Things", startDate: "2026-09-21", endDate: "2026-10-05", pricePerDay: 1 },
  { id: "slot-03", position: 3, status: "occupied", productId: "p7", sellerName: "Clayfolk Atelier", startDate: "2026-09-22", endDate: "2026-10-06", pricePerDay: 1 },
  { id: "slot-04", position: 4, status: "occupied", productId: "p9", sellerName: "Bright Day Co.", startDate: "2026-09-23", endDate: "2026-10-07", pricePerDay: 1 },
  { id: "slot-05", position: 5, status: "occupied", productId: "p11", sellerName: "Golden Hour Prints", startDate: "2026-09-23", endDate: "2026-10-07", pricePerDay: 1 },
  ...Array.from({ length: 10 }, (_, index): AdvertisingSlot => ({ id: `slot-${String(index + 6).padStart(2, "0")}`, position: index + 6, status: "available", pricePerDay: 1 })),
];

export const getAvailableAdSlots = () => advertisingSlots.filter((slot) => slot.status === "available");

export const getFeaturedDeals = (products: Product[], limit = 4) => advertisingSlots.filter((slot) => slot.status === "occupied" && slot.productId).slice(0, limit).flatMap((slot) => {
  const product = products.find((item) => item.id === slot.productId);
  return product ? [{ product, slot }] : [];
});

export const getSponsoredDealsForCategory = (products: Product[], category: string, limit = 2) => getFeaturedDeals(products, advertisingSlots.length).filter(({ product }) => product.category.toLowerCase() === category.toLowerCase()).slice(0, limit);

export const getSponsoredDealsForSearch = (products: Product[], query: string, limit = 2) => {
  const normalized = query.trim().toLowerCase();
  return getFeaturedDeals(products, advertisingSlots.length).filter(({ product }) => !normalized || [product.title, product.shop, product.category, product.couponCode].some((field) => field.toLowerCase().includes(normalized))).slice(0, limit);
};
