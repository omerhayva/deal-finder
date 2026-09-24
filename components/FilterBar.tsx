"use client";

export type Filter = "all" | "coupon" | "20" | "30" | "under20";
export type Sort = "recommended" | "discount" | "price" | "newest";

export function FilterBar({ filter, sort, onFilter, onSort }: { filter: Filter; sort: Sort; onFilter: (value: Filter) => void; onSort: (value: Sort) => void }) {
  const filters: [Filter, string][] = [["all", "All"], ["coupon", "Coupon"], ["20", "20%+"], ["30", "30%+"], ["under20", "Under $20"]];
  return <div className="flex flex-col gap-4 border-b border-ink/10 pb-5 lg:flex-row lg:items-center lg:justify-between"><div className="flex flex-wrap gap-2">{filters.map(([value, label]) => <button key={value} onClick={() => onFilter(value)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${filter === value ? "bg-ink text-white" : "bg-white text-muted hover:bg-mint hover:text-ink"}`}>{label}</button>)}</div><label className="flex items-center gap-2 text-sm text-muted">Sort by <select value={sort} onChange={(event) => onSort(event.target.value as Sort)} className="rounded-full border border-ink/15 bg-white px-4 py-2 font-medium text-ink outline-none"><option value="recommended">Recommended</option><option value="discount">Biggest Discount</option><option value="price">Lowest Price</option><option value="newest">Newest</option></select></label></div>;
}
