import { MetadataRoute } from "next";
import { getProducts } from "@/lib/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://dealfinder.example";

  const products = await getProducts();

  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/search`, lastModified: new Date() },
    { url: `${base}/submit`, lastModified: new Date() },
    ...products.map((product) => ({
      url: `${base}/product/${product.slug}`,
      lastModified: product.verifiedAt ? new Date(product.verifiedAt) : new Date(),
    })),
  ];
}
