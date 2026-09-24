import Link from "next/link";
import { Product } from "@/lib/types";
import { getFeaturedDeals } from "@/lib/advertising-data";
import { SponsoredProductCard } from "./SponsoredProductCard";

export function FeaturedDeals({ products, limit = 4, compact = false }: { products: Product[]; limit?: number; compact?: boolean }) {
  const featured = getFeaturedDeals(products, limit);
  if (!featured.length) return null;
  return <section className={compact ? "py-10" : "bg-white py-16 sm:py-20"}><div className="container-shell"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="eyebrow">Paid placement, clearly labeled</p><h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">Featured Deals</h2><p className="mt-3 max-w-xl text-sm leading-6 text-muted">A small selection of sellers paying for extra visibility while you shop.</p></div><Link href="/advertise" className="text-sm font-semibold text-coral hover:text-ink">Advertise your deal <span className="ml-1">→</span></Link></div><div className={`mt-8 grid gap-6 ${limit <= 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4"}`}>{featured.map(({ product }) => <SponsoredProductCard key={product.id} product={product} />)}</div></div></section>;
}
