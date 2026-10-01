"use client";

import Link from "next/link";
import { useLanguage } from "./LocaleProvider";

export function Header() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <header className="border-b border-ink/10 bg-canvas/90 backdrop-blur">
      <div className="container-shell flex min-h-20 items-center justify-between gap-4">
        <Link href="/" className="shrink-0 font-display text-2xl tracking-tight" aria-label="DealFinder home">
          Deal<span className="text-coral">Finder</span>
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-6 text-sm font-medium text-muted md:flex">
          <Link className="transition hover:text-ink" href="/search">{t("header.deals")}</Link>
          <Link className="transition hover:text-ink" href="/search?category=Home%20Decor">{t("header.categories")}</Link>
          <Link className="transition hover:text-ink" href="/shop/yokde">{t("header.yokdeShop")}</Link>
          <Link className="transition hover:text-ink" href="/submit">{t("header.submit")}</Link>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <label className="sr-only" htmlFor="site-language">{t("header.language")}</label>
          <select
            id="site-language"
            aria-label={t("header.language")}
            value={locale}
            onChange={(event) => setLocale(event.target.value as "en" | "tr")}
            className="max-w-[6rem] rounded-full border border-ink/15 bg-white px-2 py-2 text-xs font-semibold text-ink outline-none focus:ring-2 focus:ring-coral/30 sm:max-w-none sm:px-3 sm:text-sm"
          >
            <option value="en">{t("language.en")}</option>
            <option value="tr">{t("language.tr")}</option>
          </select>
          <Link href="/search" aria-label={t("header.search")} className="button-secondary px-3 py-2 sm:px-4 sm:py-2.5">
            <span className="mr-1 sm:mr-2" aria-hidden="true">⌕</span>
            <span className="hidden sm:inline">{t("header.search")}</span>
          </Link>
        </div>
      </div>
      <nav aria-label="Mobile navigation" className="container-shell flex gap-5 overflow-x-auto pb-3 text-sm font-medium text-muted md:hidden">
        <Link className="whitespace-nowrap hover:text-ink" href="/search">{t("header.deals")}</Link>
        <Link className="whitespace-nowrap hover:text-ink" href="/search?category=Home%20Decor">{t("header.categories")}</Link>
        <Link className="whitespace-nowrap hover:text-ink" href="/shop/yokde">{t("header.yokdeShop")}</Link>
        <Link className="whitespace-nowrap hover:text-ink" href="/submit">{t("header.submit")}</Link>
      </nav>
    </header>
  );
}
