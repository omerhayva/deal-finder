import { formatPrice } from "@/lib/utils";

export function PriceDisplay({ price, discountedPrice, discountPercent }: { price: number; discountedPrice: number; discountPercent: number }) {
  return <div className="flex flex-wrap items-baseline gap-2"><span className="text-lg font-bold text-ink">{formatPrice(discountedPrice)}</span><span className="text-sm text-muted line-through">{formatPrice(price)}</span><span className="text-xs font-bold text-coral">{discountPercent}% off</span></div>;
}
