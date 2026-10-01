import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CouponBadge } from "@/components/CouponBadge";
import { LocalizedText } from "@/components/LocalizedText";
import { PriceDisplay } from "@/components/PriceDisplay";
import { getProductBySlug, getProducts } from "@/lib/products";
import { formatDate, formatPrice } from "@/lib/utils";
import { getRequestLocale } from "@/lib/i18n/server";
import { translate } from "@/lib/i18n/messages";
import { outboundUrl } from "@/lib/outbound";

interface ProductRouteProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const locale = await getRequestLocale();
  const price = formatPrice(product.discountedPrice, product.currency, locale);
  const description = locale === "tr"
    ? `${product.title} — ${price}. Güncel fiyat ve teklif ayrıntılarını Etsy'de kontrol edin.`
    : `${product.title} — ${price}. Check the current price and offer details on Etsy.`;

  return { title: product.title, description };
}

export default async function ProductPage({ params }: ProductRouteProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const locale = await getRequestLocale();
  const categoryKey = `category.${product.category}` as const;
  const addedDate = formatDate(product.createdAt ?? product.publishedAt, locale);
  const savings = Math.max(0, product.price - product.discountedPrice);

  return (
    <section className="container-shell py-12 sm:py-20">
      <Link href="/search" className="text-sm font-semibold text-muted hover:text-coral">
        ← <LocalizedText id="product.back" />
      </Link>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="overflow-hidden rounded-3xl bg-mint">
          {product.image ? (
            <img src={product.image} alt={product.title} className="aspect-square h-full w-full object-cover" />
          ) : (
            <div className="flex aspect-square items-center justify-center text-7xl text-ink/30" aria-hidden="true">✦</div>
          )}
        </div>
        <div>
          <p className="eyebrow">{translate(locale, categoryKey)}</p>
          <h1 className="mt-4 font-display text-5xl leading-tight tracking-tight sm:text-6xl">{product.title}</h1>
          <p className="mt-5 text-muted">
            <LocalizedText id="product.from" values={{ shop: product.shop }} />
          </p>
          <div className="mt-8">
            <PriceDisplay
              price={product.price}
              discountedPrice={product.discountedPrice}
              discountPercent={product.discountPercent}
              currency={product.currency}
            />
          </div>

          {product.couponCode ? (
            <div className="mt-7 rounded-2xl border border-coral/20 bg-[#fff7f3] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-coral"><LocalizedText id="product.activeCoupon" /></p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <CouponBadge code={product.couponCode} />
                <span className="text-sm text-muted">
                  {product.expiresAt ? <LocalizedText id="product.ends" values={{ date: formatDate(product.expiresAt, locale) }} /> : <LocalizedText id="product.noExpiration" />}
                </span>
              </div>
            </div>
          ) : (
            <p className="mt-6 rounded-xl bg-white p-4 text-sm text-muted"><LocalizedText id="product.noCoupon" /></p>
          )}

          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-white p-4">
              <p className="text-xs text-muted"><LocalizedText id="product.added" /></p>
              <p className="mt-1 font-semibold">{addedDate}</p>
            </div>
            <div className="rounded-xl bg-white p-4">
              <p className="text-xs text-muted"><LocalizedText id="product.youSave" /></p>
              <p className="mt-1 font-semibold text-coral">
                {savings > 0 ? formatPrice(savings, product.currency, locale) : <LocalizedText id="product.noPriceSavings" />}
              </p>
            </div>
          </div>

          <Link href={outboundUrl({ id: product.id, url: product.etsyUrl, label: product.title })} className="button-primary mt-7 w-full">
            <LocalizedText id="product.viewOnEtsy" /> <span className="ml-2" aria-hidden="true">↗</span>
          </Link>
          {product.description && (
            <div className="mt-8 border-t border-ink/10 pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted"><LocalizedText id="product.description" /></p>
              <p className="mt-3 leading-7 text-muted">{product.description}</p>
            </div>
          )}
          <p className="mt-8 border-t border-ink/10 pt-6 text-sm leading-6 text-muted"><LocalizedText id="product.sellerNotice" /></p>
        </div>
      </div>
    </section>
  );
}
