import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CouponBadge } from "@/components/CouponBadge";
import { PriceDisplay } from "@/components/PriceDisplay";
import { getProductBySlug, getProducts } from "@/lib/products";
import { formatDate } from "@/lib/utils";
import { outboundUrl } from "@/lib/outbound";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  return product
    ? {
        title: product.title,
        description: `${product.title} from ${product.shop}. Save ${product.discountPercent}% with coupon ${product.couponCode}.`,
      }
    : {};
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  return (
    <section className="container-shell py-12 sm:py-20">
      <Link href="/search" className="text-sm font-semibold text-muted hover:text-coral">
        ← Back to deals
      </Link>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="overflow-hidden rounded-3xl bg-mint">
          <img
            src={product.image || "https://placehold.co/600x600/mint/white?text=No+Image"}
            alt={product.title}
            className="aspect-square h-full w-full object-cover"
          />
        </div>
        <div>
          <p className="eyebrow">{product.category}</p>
          <h1 className="mt-4 font-display text-5xl leading-tight tracking-tight sm:text-6xl">
            {product.title}
          </h1>
          <p className="mt-5 text-muted">
            from <span className="font-semibold text-ink">{product.shop}</span>
          </p>
          <div className="mt-8">
            <PriceDisplay
              price={product.price}
              discountedPrice={product.discountedPrice}
              discountPercent={product.discountPercent}
            />
          </div>
          <div className="mt-7 rounded-2xl border border-coral/20 bg-[#fff7f3] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-coral">Active coupon</p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <CouponBadge code={product.couponCode || "N/A"} />
              <span className="text-sm text-muted">
                {product.expiresAt ? `Expires ${formatDate(product.expiresAt)}` : "No expiration listed"}
              </span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-white p-4">
              <p className="text-xs text-muted">Last verified</p>
              <p className="mt-1 font-semibold">{product.verifiedAt ? formatDate(product.verifiedAt) : "—"}</p>
            </div>
            <div className="rounded-xl bg-white p-4">
              <p className="text-xs text-muted">You save</p>
              <p className="mt-1 font-semibold text-coral">{product.discountPercent}% today</p>
            </div>
          </div>
          <Link
            href={outboundUrl({ id: product.id, url: product.etsyUrl, label: product.title })}
            className="button-primary mt-7 w-full"
          >
            View on Etsy <span className="ml-2">↗</span>
          </Link>
          {product.description && (
            <div className="mt-8 border-t border-ink/10 pt-6">
              <p className="text-sm text-muted">{product.description}</p>
            </div>
          )}
          <div className="mt-8 border-t border-ink/10 pt-6">
            <p className="text-sm text-muted">
              Coupon verification feedback coming soon.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
