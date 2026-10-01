import { translate, type Locale } from "@/lib/i18n/messages";
import { yokdeListingUrl, type YokdeListing } from "@/lib/yokde-shop";

export function YokdeProductCard({ listing, locale }: { listing: YokdeListing; locale: Locale }) {
  const price = new Intl.NumberFormat(locale === "tr" ? "tr-TR" : "en-US", {
    style: "currency",
    currency: "USD",
  }).format(listing.priceUsd);
  const viewOnEtsy = translate(locale, "shop.viewOnEtsy");

  return (
    <article className="group overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-soft transition duration-300 hover:-translate-y-1">
      <a
        href={yokdeListingUrl(listing)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${viewOnEtsy}: ${listing.title}`}
        className="block h-full"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-mint">
          <img
            src={listing.image}
            alt={listing.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-ink backdrop-blur">
            YOKDE
          </span>
        </div>
        <div className="flex min-h-[11.5rem] flex-col p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            {translate(locale, "shop.listingLabel")}
          </p>
          <h3 className="mt-2 min-h-[3.5rem] text-base font-semibold leading-7 text-ink group-hover:text-coral">
            {listing.title}
          </h3>
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="text-base font-bold text-ink sm:text-lg">
              {translate(locale, "shop.priceFrom", { price })}
            </span>
            <span className="text-sm font-semibold text-coral">
              {viewOnEtsy} <span aria-hidden="true">↗</span>
            </span>
          </div>
        </div>
      </a>
    </article>
  );
}
