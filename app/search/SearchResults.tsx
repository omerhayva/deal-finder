"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { FilterBar, Filter, Sort } from "@/components/FilterBar";
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

  const results = useMemo(() => {
    let items = searchProducts(allProducts, query);
    if (category) items = items.filter((product) => product.category.toLowerCase() === category.toLowerCase());
    if (filter === "coupon") items = items.filter((product) => product.couponCode);
    if (filter === "20") items = items.filter((product) => product.discountPercent >= 20);
    if (filter === "30") items = items.filter((product) => product.discountPercent >= 30);
    if (filter === "under20") items = items.filter((product) => product.discountedPrice < 20);
    if (sort === "discount") items = [...items].sort((a, b) => b.discountPercent - a.discountPercent);
    if (sort === "price") items = [...items].sort((a, b) => a.discountedPrice - b.discountedPrice);
    if (sort === "newest") items = [...items].sort((a, b) => b.verifiedAt.localeCompare(a.verifiedAt));
    return items;
  }, [allProducts, query, category, filter, sort]);

  return (
    <>
      <div className="mt-8">
        <FilterBar filter={filter} sort={sort} onFilter={setFilter} onSort={setSort} />
      </div>
      {results.length ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-3xl bg-white px-6 py-20 text-center">
          <p className="font-display text-3xl">No deals found yet.</p>
          <p className="mt-3 text-muted">Try a broader search or explore all our categories.</p>
        </div>
      )}
    </>
  );
}
