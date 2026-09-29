import type { Metadata } from "next";
import { SearchBar } from "@/components/SearchBar";
import { SearchResults } from "./SearchResults";
import { getProducts, getAllProducts } from "@/lib/products";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}): Promise<Metadata> {
  const query = searchParams.q ?? searchParams.category ?? "all deals";
  return {
    title: `Deals for ${query}`,
    description: `Browse discounted products and active coupons for ${query} on DealFinder.`,
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  const allProducts = await getAllProducts();
  const query = searchParams.q ?? "";
  const category = searchParams.category ?? "";
  const heading = query ? `Deals for "${query}"` : category ? `${category} deals` : "All deals";

  return (
    <section className="container-shell py-12 sm:py-16">
      <div className="flex flex-col gap-8 border-b border-ink/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow">Explore the collection</p>
          <h1 className="mt-3 font-display text-5xl tracking-tight sm:text-6xl">{heading}</h1>
          <p className="mt-4 text-muted">Hand-picked deals with verified savings.</p>
        </div>
        <SearchBar initialValue={query} compact />
      </div>
      <SearchResults products={allProducts} query={query} category={category} />
    </section>
  );
}
