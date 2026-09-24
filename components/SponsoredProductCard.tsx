import Link from "next/link";
import { Product } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { CouponBadge } from "./CouponBadge";
import { PriceDisplay } from "./PriceDisplay";
import { outboundUrl } from "@/lib/outbound";

export function SponsoredProductCard({ product }: { product: Product }) {
  return <article className="group overflow-hidden rounded-2xl border border-coral/20 bg-white shadow-[0_18px_50px_rgba(233,111,80,0.1)] transition duration-300 hover:-translate-y-1">
    <div className="flex items-center justify-between border-b border-coral/10 bg-[#fffaf7] px-4 py-2"><span className="text-[10px] font-bold uppercase tracking-[0.18em] text-coral">Featured deal</span><span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Sponsored</span></div>
    <Link href={`/product/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-mint"><img src={product.image} alt={product.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><span className="absolute left-3 top-3 rounded-full bg-coral px-3 py-1 text-xs font-bold text-white">{product.discountPercent}% off</span></Link>
    <div className="p-5"><p className="text-xs font-semibold uppercase tracking-wider text-muted">{product.category} · {product.shop}</p><Link href={`/product/${product.slug}`} className="mt-2 block min-h-[3.5rem] text-lg font-semibold leading-7 text-ink hover:text-coral">{product.title}</Link><div className="mt-3"><PriceDisplay price={product.price} discountedPrice={product.discountedPrice} discountPercent={product.discountPercent} /></div><div className="mt-4 flex items-center justify-between gap-2"><CouponBadge code={product.couponCode} />{product.expiresAt && <span className="text-[11px] text-muted">Ends {formatDate(product.expiresAt)}</span>}</div><Link href={outboundUrl({ id: product.id, url: product.etsyUrl, label: product.title })} className="mt-5 flex items-center justify-center rounded-xl bg-coral px-4 py-3 text-sm font-semibold text-white transition hover:bg-ink">View Deal <span className="ml-2">↗</span></Link></div>
  </article>;
}
