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

/**
 * Validates a string as a ProductCategory.
 * Returns the validated category or "General" as fallback.
 */
export function productCategoryValidate(value: string): ProductCategory {
  const valid: ProductCategory[] = [
    "Wedding",
    "Home Decor",
    "Digital Products",
    "Gifts",
    "Jewelry",
    "Clothing",
    "Printable",
    "Wall Art",
  ];
  return valid.includes(value as ProductCategory) ? (value as ProductCategory) : "General";
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
  verifiedAt: string;
  featured?: boolean;
  featuredUntil?: string;
  // --- Production fields ---
  description?: string;
  source?: string;
  sourceId?: string;
  currency?: string;
  status?: ProductStatus;
  createdAt?: string;
  updatedAt?: string;
};

/** MOCK DATA — for development/demo only. Replace with real API data when backend is connected. */
export const products: Product[] = [
  {
    id: "p1",
    shop: "Paper & Pine Studio",
    title: "Minimalist Wedding Invitation Suite",
    slug: "minimalist-wedding-invitation-suite",
    image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=80",
    etsyUrl: "https://www.etsy.com/",
    price: 32,
    discountedPrice: 22.4,
    category: "Wedding",
    couponCode: "PINE20",
    discountPercent: 30,
    expiresAt: "2026-10-14",
    verifiedAt: "2026-09-20",
  },
  {
    id: "p2",
    shop: "North & Nook",
    title: "Handmade Oak Floating Shelf",
    slug: "handmade-oak-floating-shelf",
    image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=900&q=80",
    etsyUrl: "https://www.etsy.com/",
    price: 64,
    discountedPrice: 51.2,
    category: "Home Decor",
    couponCode: "NOOK20",
    discountPercent: 20,
    expiresAt: "2026-10-04",
    verifiedAt: "2026-09-18",
  },
  {
    id: "p3",
    shop: "Kindred Type",
    title: "Editable Brand Strategy Template",
    slug: "editable-brand-strategy-template",
    image: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=900&q=80",
    etsyUrl: "https://www.etsy.com/",
    price: 18,
    discountedPrice: 12.6,
    category: "Digital Products",
    couponCode: "TYPE30",
    discountPercent: 30,
    verifiedAt: "2026-09-21",
  },
  {
    id: "p4",
    shop: "Little Good Things",
    title: "Personalized Birth Flower Necklace",
    slug: "personalized-birth-flower-necklace",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80",
    etsyUrl: "https://www.etsy.com/",
    price: 48,
    discountedPrice: 33.6,
    category: "Jewelry",
    couponCode: "GOODGIFT",
    discountPercent: 30,
    expiresAt: "2026-10-31",
    verifiedAt: "2026-09-19",
  },
  {
    id: "p5",
    shop: "Studio Sunday",
    title: "Weekly Reset Printable Planner",
    slug: "weekly-reset-printable-planner",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=900&q=80",
    etsyUrl: "https://www.etsy.com/",
    price: 14,
    discountedPrice: 9.8,
    category: "Printable",
    couponCode: "RESET30",
    discountPercent: 30,
    verifiedAt: "2026-09-17",
  },
  {
    id: "p6",
    shop: "Moss & Frame",
    title: "Abstract Terracotta Gallery Wall Print",
    slug: "abstract-terracotta-gallery-wall-print",
    image: "https://images.unsplash.com/photo-1577083552431-6e5fd01988a5?auto=format&fit=crop&w=900&q=80",
    etsyUrl: "https://www.etsy.com/",
    price: 26,
    discountedPrice: 20.8,
    category: "Wall Art",
    couponCode: "FRAME20",
    discountPercent: 20,
    expiresAt: "2026-09-30",
    verifiedAt: "2026-09-16",
  },
  {
    id: "p7",
    shop: "Clayfolk Atelier",
    title: "Speckled Ceramic Match Striker",
    slug: "speckled-ceramic-match-striker",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=80",
    etsyUrl: "https://www.etsy.com/",
    price: 29,
    discountedPrice: 18.85,
    category: "Home Decor",
    couponCode: "CLAY35",
    discountPercent: 35,
    expiresAt: "2026-10-08",
    verifiedAt: "2026-09-20",
  },
  {
    id: "p8",
    shop: "Oak & Thread",
    title: "Relaxed Linen Everyday Shirt",
    slug: "relaxed-linen-everyday-shirt",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
    etsyUrl: "https://www.etsy.com/",
    price: 72,
    discountedPrice: 57.6,
    category: "Clothing",
    couponCode: "THREAD20",
    discountPercent: 20,
    verifiedAt: "2026-09-15",
  },
  {
    id: "p9",
    shop: "Bright Day Co.",
    title: "Custom Family Recipe Keepsake",
    slug: "custom-family-recipe-keepsake",
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80",
    etsyUrl: "https://www.etsy.com/",
    price: 38,
    discountedPrice: 24.7,
    category: "Gifts",
    couponCode: "BRIGHT35",
    discountPercent: 35,
    expiresAt: "2026-11-01",
    verifiedAt: "2026-09-22",
  },
  {
    id: "p10",
    shop: "The Little Press",
    title: "Modern Table Number Cards",
    slug: "modern-table-number-cards",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80",
    etsyUrl: "https://www.etsy.com/",
    price: 21,
    discountedPrice: 16.8,
    category: "Wedding",
    couponCode: "PRESS20",
    discountPercent: 20,
    verifiedAt: "2026-09-14",
  },
  {
    id: "p11",
    shop: "Golden Hour Prints",
    title: "Sunlit Mediterranean Travel Poster",
    slug: "sunlit-mediterranean-travel-poster",
    image: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=900&q=80",
    etsyUrl: "https://www.etsy.com/",
    price: 24,
    discountedPrice: 15.6,
    category: "Wall Art",
    couponCode: "HOUR35",
    discountPercent: 35,
    verifiedAt: "2026-09-13",
  },
  {
    id: "p12",
    shop: "Woven Ritual",
    title: "Handwoven Checkerboard Tote",
    slug: "handwoven-checkerboard-tote",
    image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=80",
    etsyUrl: "https://www.etsy.com/",
    price: 55,
    discountedPrice: 44,
    category: "Gifts",
    couponCode: "WOVEN20",
    discountPercent: 20,
    expiresAt: "2026-10-21",
    verifiedAt: "2026-09-12",
  },
];

export const getProductBySlug = (slug: string) => products.find((product) => product.slug === slug);
export const getProductById = (id: string) => products.find((product) => product.id === id);
