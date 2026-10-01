"use client";

import Link from "next/link";
import type { Product } from "@/lib/products/types";
import { formatDate } from "@/lib/utils";
import { useLanguage } from "./LocaleProvider";
import { CouponBadge } from "./CouponBadge";
import { PriceDisplay } from "./PriceDisplay";
import { outboundUrl } from "@/lib/outbound";

export function ProductCard({ product }: { product: Product }) {
  const { t, locale } = useLanguage();
  const categoryKey = `category.${product.category}` as const;

  return (
    <article className="group overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-soft transition duration-300 hover:-translate-y-1">
      <Link href={`/product/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-mint">
        {product.image ? (
          <img src={product.image} alt={product.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl text-ink/30" aria-hidden="true">✦</div>
        )}
        {(product.discountPercent > 0 || product.couponCode) && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-coral backdrop-blur">
            {product.discountPercent > 0
              ? t("product.discountOff", { percent: product.discountPercent })
              : t("product.couponOffer")}
          </span>
        )}
      </Link>
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          {t(categoryKey)} · {product.shop}
        </p>
        <Link href={`/product/${product.slug}`} className="mt-2 block min-h-[3.5rem] text-lg font-semibold leading-7 text-ink hover:text-coral">
          {product.title}
        </Link>
        <div className="mt-3">
          <PriceDisplay
            price={product.price}
            discountedPrice={product.discountedPrice}
            discountPercent={product.discountPercent}
            currency={product.currency}
          />
        </div>
        <div className="mt-4 flex min-h-10 items-center justify-between gap-2">
          {product.couponCode ? <CouponBadge code={product.couponCode} /> : <span />}
          {product.expiresAt && <span className="text-[11px] text-muted">{t("product.ends", { date: formatDate(product.expiresAt, locale) })}</span>}
        </div>
        <Link href={outboundUrl({ id: product.id, url: product.etsyUrl, label: product.title })} className="mt-5 flex items-center justify-center rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2">
          {t("product.viewDeal")} <span className="ml-2" aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}
