"use client";

import Link from "next/link";
import { useLanguage } from "./LocaleProvider";

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-ink/10 bg-white">
      <div className="container-shell grid gap-9 py-10 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <Link href="/" className="font-display text-xl">Deal<span className="text-coral">Finder</span></Link>
          <p className="mt-2 max-w-xs text-sm leading-6 text-muted">{t("footer.tagline")}</p>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-6 text-sm text-muted sm:grid-cols-4 sm:gap-x-10">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink">{t("footer.explore")}</p>
            <Link href="/" className="block hover:text-ink">{t("footer.home")}</Link>
            <Link href="/shop/yokde" className="mt-2 block hover:text-ink">{t("footer.yokdeShop")}</Link>
            <Link href="/submit" className="mt-2 block hover:text-ink">{t("footer.submit")}</Link>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink">{t("footer.information")}</p>
            <Link href="/about" className="block hover:text-ink">{t("footer.about")}</Link>
            <Link href="/faq" className="mt-2 block hover:text-ink">{t("footer.faq")}</Link>
            <Link href="/contact" className="mt-2 block hover:text-ink">{t("footer.contact")}</Link>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink">{t("footer.legal")}</p>
            <Link href="/privacy" className="block hover:text-ink">{t("footer.privacy")}</Link>
            <Link href="/terms" className="mt-2 block hover:text-ink">{t("footer.terms")}</Link>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink">{t("footer.categories")}</p>
            <Link href="/search" className="block hover:text-ink">{t("footer.allDeals")}</Link>
            <Link href="/search?category=Home%20Decor" className="mt-2 block hover:text-ink">{t("category.Home Decor")}</Link>
          </div>
        </div>
      </div>
      <div className="container-shell border-t border-ink/10 py-5 text-xs text-muted">
        © {new Date().getFullYear()} DealFinder. {t("footer.copyright")}
      </div>
    </footer>
  );
}
