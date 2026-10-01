import type { Metadata } from "next";
import { SearchBar } from "@/components/SearchBar";
import { SearchResults } from "./SearchResults";
import { getApprovedProducts } from "@/lib/products";
import { getRequestLocale } from "@/lib/i18n/server";
import { translate, translateCategory } from "@/lib/i18n/messages";
import { MarketplaceTabs } from "@/components/MarketplaceTabs";

interface SearchPageProps {
  searchParams: Promise<{ q?: string | string[]; category?: string | string[] }>;
}

function first(value?: string | string[]): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const locale = await getRequestLocale();
  const query = first(params.q);
  const category = first(params.category);
  const title = query
    ? translate(locale, "search.queryTitle", { query })
    : category
      ? translate(locale, "search.categoryTitle", { category: translateCategory(locale, category) })
      : translate(locale, "search.allDeals");
  return { title, description: translate(locale, "search.description"), robots: { index: false, follow: true } };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = first(params.q).slice(0, 120);
  const category = first(params.category).slice(0, 80);
  const locale = await getRequestLocale();
  const heading = query
    ? translate(locale, "search.queryTitle", { query })
    : category
      ? translate(locale, "search.categoryTitle", { category: translateCategory(locale, category) })
      : translate(locale, "search.allDeals");
  const products = await getApprovedProducts();

  return (
    <section className="container-shell py-12 sm:py-16">
      <div className="flex flex-col gap-8 border-b border-ink/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow">{translate(locale, "search.eyebrow")}</p>
          <h1 className="mt-3 font-display text-5xl tracking-tight sm:text-6xl">{heading}</h1>
          <p className="mt-4 text-muted">{translate(locale, "search.description")}</p>
        </div>
        <SearchBar initialValue={query} compact />
      </div>
      <div className="py-8">
        <MarketplaceTabs />
      </div>
      <SearchResults products={products} query={query} category={category} />
    </section>
  );
}
