import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";
import { ProductCard } from "@/components/ProductCard";
import { YokdeProductCard } from "@/components/YokdeProductCard";
import { LocalizedText } from "@/components/LocalizedText";
import { getApprovedProducts } from "@/lib/products";
import { getRequestLocale } from "@/lib/i18n/server";
import { MarketplaceTabs } from "@/components/MarketplaceTabs";
import { YOKDE_FEATURED_LISTINGS } from "@/lib/yokde-shop";

const examples = {
  en: ["minimalist wedding invitation", "wall art", "personalized gift", "printable planner", "jewelry"],
  tr: ["düğün davetiyesi", "duvar dekoru", "kişiye özel hediye", "ajanda", "takı"],
} as const;

export default async function HomePage() {
  const products = await getApprovedProducts();
  const locale = await getRequestLocale();

  return (
    <>
      <section className="container-shell relative overflow-hidden pb-20 pt-16 sm:pb-28 sm:pt-24">
        <div className="pointer-events-none absolute -right-28 -top-20 h-80 w-80 rounded-full bg-mint/70 blur-3xl" />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="eyebrow"><LocalizedText id="home.heroEyebrow" /></p>
          <h1 className="mt-5 font-display text-6xl leading-[0.95] tracking-tight sm:text-8xl">
            <LocalizedText id="home.heroTitle" />
          </h1>
          <p className="mx-auto mt-7 max-w-xl text-lg leading-8 text-muted">
            <LocalizedText id="home.heroDescription" />
          </p>
          <div className="mx-auto mt-10">
            <SearchBar />
          </div>
          <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-muted">
            <span><LocalizedText id="home.try" /></span>
            {examples[locale].map((example) => (
              <Link
                key={example}
                href={`/search?q=${encodeURIComponent(example)}`}
                className="font-medium underline decoration-ink/20 underline-offset-4 hover:text-coral"
              >
                {example}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="container-shell py-7 sm:py-9">
        <MarketplaceTabs />
      </div>

      <section className="bg-mint/40 py-16 sm:py-20">
        <div className="container-shell">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow"><LocalizedText id="shop.featureEyebrow" /></p>
              <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
                <LocalizedText id="shop.featureTitle" />
              </h2>
              <p className="mt-4 max-w-2xl leading-7 text-muted">
                <LocalizedText id="shop.featureDescription" />
              </p>
            </div>
            <Link href="/shop/yokde" className="text-sm font-semibold text-coral hover:text-ink">
              <LocalizedText id="shop.browseAll" /> <span className="ml-1" aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {YOKDE_FEATURED_LISTINGS.map((listing) => (
              <YokdeProductCard key={listing.id} listing={listing} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-shell">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow"><LocalizedText id="home.curated" /></p>
              <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
                <LocalizedText id="home.trending" />
              </h2>
            </div>
            <Link href="/search" className="text-sm font-semibold text-coral hover:text-ink">
              <LocalizedText id="home.seeAll" /> <span className="ml-1" aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-ink/5 bg-canvas px-6 py-12 text-center">
                <h3 className="font-display text-3xl"><LocalizedText id="home.noDealsTitle" /></h3>
                <p className="mx-auto mt-3 max-w-lg leading-7 text-muted"><LocalizedText id="home.noDealsDescription" /></p>
              </div>
            ) : (
              products.slice(0, 8).map((product) => <ProductCard key={product.id} product={product} />)
            )}
          </div>
        </div>
      </section>

      <section className="container-shell py-20">
        <div className="rounded-3xl bg-mint px-6 py-12 text-center sm:px-12">
          <p className="eyebrow"><LocalizedText id="home.sellerEyebrow" /></p>
          <h2 className="mx-auto mt-3 max-w-xl font-display text-4xl tracking-tight">
            <LocalizedText id="home.sellerTitle" />
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted"><LocalizedText id="home.sellerDescription" /></p>
          <Link href="/submit" className="button-primary mt-7">
            <LocalizedText id="home.submitCta" /> <span className="ml-2" aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
