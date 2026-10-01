import type { Metadata } from "next";
import Link from "next/link";
import { YokdeProductCard } from "@/components/YokdeProductCard";
import { LocalizedText } from "@/components/LocalizedText";
import { getRequestLocale } from "@/lib/i18n/server";
import { translate } from "@/lib/i18n/messages";
import { YOKDE_IMPORTED_AT, YOKDE_LISTINGS, YOKDE_SHOP_URL } from "@/lib/yokde-shop";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return {
    title: translate(locale, "shop.pageTitle"),
    description: translate(locale, "shop.pageDescription"),
  };
}

export default async function YokdeShopPage() {
  const locale = await getRequestLocale();

  return (
    <>
      <section className="bg-mint/70 py-14 sm:py-20">
        <div className="container-shell">
          <Link href="/" className="text-sm font-semibold text-muted hover:text-ink">
            ← <LocalizedText id="footer.home" />
          </Link>
          <div className="mt-8 max-w-3xl">
            <p className="eyebrow"><LocalizedText id="shop.pageEyebrow" /></p>
            <h1 className="mt-3 font-display text-5xl tracking-tight sm:text-7xl">
              <LocalizedText id="shop.pageTitle" />
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
              <LocalizedText id="shop.pageDescription" />
            </p>
            <a href={YOKDE_SHOP_URL} target="_blank" rel="noopener noreferrer" className="button-primary mt-7">
              <LocalizedText id="shop.visitStore" /> <span className="ml-2" aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      <section className="container-shell py-14 sm:py-20">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow"><LocalizedText id="shop.productsEyebrow" /></p>
            <h2 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">
              <LocalizedText id="shop.productsTitle" />
            </h2>
          </div>
          <span className="text-sm font-semibold text-muted">
            {translate(locale, "shop.productCount", { count: YOKDE_LISTINGS.length })}
          </span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {YOKDE_LISTINGS.map((listing) => (
            <YokdeProductCard key={listing.id} listing={listing} locale={locale} />
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-ink/10 bg-white p-6 text-sm leading-7 text-muted sm:p-8">
          <p className="font-semibold text-ink"><LocalizedText id="shop.ownerDisclosure" /></p>
          <p className="mt-3"><LocalizedText id="shop.priceNote" values={{ date: YOKDE_IMPORTED_AT }} /></p>
        </div>
      </section>
    </>
  );
}
