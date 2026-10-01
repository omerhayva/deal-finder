import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

function getSiteUrl(): URL | undefined {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.hostname === "localhost" ? url : undefined;
  } catch {
    return undefined;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  if (!siteUrl) return [];

  const staticPaths = ["/", "/about", "/faq", "/contact", "/privacy", "/terms", "/submit", "/shop/yokde"];
  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: new URL(path, siteUrl).toString(),
    changeFrequency: path === "/" ? "daily" : "monthly",
    priority: path === "/" ? 1 : 0.4,
  }));

  const products = await getProducts();
  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: new URL(`/product/${encodeURIComponent(product.slug)}`, siteUrl).toString(),
    lastModified: product.updatedAt ?? product.createdAt ?? product.publishedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticEntries, ...productEntries];
}
