import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";
import { ProductCard } from "@/components/ProductCard";
import { getApprovedProducts } from "@/lib/products";

const examples = [
  "minimalist wedding invitation",
  "wall art",
  "personalized gift",
  "printable planner",
  "jewelry",
];

export default async function HomePage() {
  const products = await getApprovedProducts();

  return (
    <>
      <section className="container-shell relative overflow-hidden pb-20 pt-16 sm:pb-28 sm:pt-24">
        <div className="pointer-events-none absolute -right-28 -top-20 h-80 w-80 rounded-full bg-mint/70 blur-3xl" />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="eyebrow">Thoughtful finds, less digging</p>
          <h1 className="mt-5 font-display text-6xl leading-[0.95] tracking-tight sm:text-8xl">
            Find Better <span className="text-coral">Deals.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-xl text-lg leading-8 text-muted">
            Discover discounted products and active coupons from independent Etsy sellers.
          </p>
          <div className="mx-auto mt-10">
            <SearchBar />
          </div>
          <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-muted">
            <span>Try:</span>
            {examples.map((example) => (
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

      <section className="bg-white py-16 sm:py-20">
        <div className="container-shell">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Curated today</p>
              <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
                {products.length > 0 ? "Trending Deals" : "No deals yet"}
              </h2>
            </div>
            <Link href="/search" className="text-sm font-semibold text-coral hover:text-ink">
              See all deals <span className="ml-1">→</span>
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.length === 0 ? (
              <div className="col-span-4 text-center text-muted py-8">
                Henüz yayınlanmış fırsat bulunmuyor.
              </div>
            ) : (
              products.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      <section className="container-shell py-20">
        <div className="rounded-3xl bg-mint px-6 py-12 text-center sm:px-12">
          <p className="eyebrow">For independent sellers</p>
          <h2 className="mx-auto mt-3 max-w-xl font-display text-4xl tracking-tight">
            Have a deal worth sharing?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted">
            Put your product in front of people who are already looking for their next favorite find.
          </p>
          <Link href="/submit" className="button-primary mt-7">
            Submit your deal <span className="ml-2">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
