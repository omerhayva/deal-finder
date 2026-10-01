"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { FilterBar, type Filter, type Sort } from "@/components/FilterBar";
import { useLanguage } from "@/components/LocaleProvider";
import { searchProducts } from "@/lib/utils";
import type { Product } from "@/lib/products/types";

interface SearchResultsProps {
  products: Product[];
  query: string;
  category: string;
}

export function SearchResults({ products: allProducts, query, category }: SearchResultsProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("recommended");
  const { t } = useLanguage();

  const results = useMemo(() => {
    let items = searchProducts(allProducts, query);
    if (category) items = items.filter((product) => product.category.toLocaleLowerCase("tr-TR") === category.toLocaleLowerCase("tr-TR"));
    if (filter === "coupon") items = items.filter((product) => Boolean(product.couponCode));
    if (filter === "20") items = items.filter((product) => product.discountPercent >= 20);
    if (filter === "30") items = items.filter((product) => product.discountPercent >= 30);
    if (filter === "under20") items = items.filter((product) => product.discountedPrice < 20 && (product.currency ?? "USD") === "USD");
    if (sort === "discount") items = [...items].sort((a, b) => b.discountPercent - a.discountPercent);
    if (sort === "price") items = [...items].sort((a, b) => a.discountedPrice - b.discountedPrice);
    if (sort === "newest") items = [...items].sort((a, b) => (b.createdAt ?? b.publishedAt ?? "").localeCompare(a.createdAt ?? a.publishedAt ?? ""));
    return items;
  }, [allProducts, query, category, filter, sort]);

  return (
    <>
      <div className="mt-8">
        <FilterBar filter={filter} sort={sort} onFilter={setFilter} onSort={setSort} />
      </div>
      <p className="mt-5 text-sm text-muted" aria-live="polite">{t("search.resultsCount", { count: results.length })}</p>
      {results.length ? (
        <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="mt-8 rounded-3xl bg-white px-6 py-20 text-center">
          <p className="font-display text-3xl">{t("search.emptyTitle")}</p>
          <p className="mt-3 text-muted">{t("search.emptyDescription")}</p>
        </div>
      )}
    </>
  );
}
