import { MetadataRoute } from "next";
import { products } from "@/lib/mock-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://dealfinder.example";
  return [{ url: base, lastModified: new Date() }, { url: `${base}/search`, lastModified: new Date() }, { url: `${base}/submit`, lastModified: new Date() }, ...products.map((product) => ({ url: `${base}/product/${product.slug}`, lastModified: new Date(product.verifiedAt) }))];
}
