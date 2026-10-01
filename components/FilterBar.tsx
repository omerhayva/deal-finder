"use client";

import type { MessageKey } from "@/lib/i18n/messages";
import { useLanguage } from "./LocaleProvider";

export type Filter = "all" | "coupon" | "20" | "30" | "under20";
export type Sort = "recommended" | "discount" | "price" | "newest";

const filters: [Filter, MessageKey][] = [
  ["all", "filters.all"],
  ["coupon", "filters.coupon"],
  ["20", "filters.twenty"],
  ["30", "filters.thirty"],
  ["under20", "filters.underTwenty"],
];

export function FilterBar({
  filter,
  sort,
  onFilter,
  onSort,
}: {
  filter: Filter;
  sort: Sort;
  onFilter: (value: Filter) => void;
  onSort: (value: Sort) => void;
}) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col gap-4 border-b border-ink/10 pb-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap gap-2" aria-label={t("filters.all")}>
        {filters.map(([value, key]) => (
          <button
            type="button"
            key={value}
            aria-pressed={filter === value}
            onClick={() => onFilter(value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${filter === value ? "bg-ink text-white" : "bg-white text-muted hover:bg-mint hover:text-ink"}`}
          >
            {t(key)}
          </button>
        ))}
      </div>
      <label className="flex items-center gap-2 text-sm text-muted">
        {t("filters.sortBy")}
        <select value={sort} onChange={(event) => onSort(event.target.value as Sort)} className="rounded-full border border-ink/15 bg-white px-4 py-2 font-medium text-ink outline-none focus:ring-2 focus:ring-coral/30">
          <option value="recommended">{t("filters.recommended")}</option>
          <option value="discount">{t("filters.discount")}</option>
          <option value="price">{t("filters.price")}</option>
          <option value="newest">{t("filters.newest")}</option>
        </select>
      </label>
    </div>
  );
}
