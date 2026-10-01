"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LocaleProvider";

export function MarketplaceTabs() {
  const { t } = useLanguage();

  return (
    <nav aria-label={t("marketplace.navLabel")} className="flex flex-wrap items-center justify-center gap-2">
      <Link
        href="/search"
        aria-current="page"
        className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white shadow-sm"
      >
        {t("marketplace.etsy")}
      </Link>
      <button
        type="button"
        disabled
        aria-disabled="true"
        className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-ink/10 bg-white px-5 py-2.5 text-sm font-semibold text-muted opacity-80"
      >
        {t("marketplace.amazonSoon")}
      </button>
      <button
        type="button"
        disabled
        aria-disabled="true"
        className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-ink/10 bg-white px-5 py-2.5 text-sm font-semibold text-muted opacity-80"
      >
        {t("marketplace.ebaySoon")}
      </button>
    </nav>
  );
}
