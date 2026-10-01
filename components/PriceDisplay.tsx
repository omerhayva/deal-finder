"use client";

import { formatPrice } from "@/lib/utils";
import { useLanguage } from "./LocaleProvider";

export function PriceDisplay({
  price,
  discountedPrice,
  discountPercent,
  currency = "USD",
}: {
  price: number;
  discountedPrice: number;
  discountPercent: number;
  currency?: string;
}) {
  const { locale, t } = useLanguage();
  const hasPriceDrop = discountedPrice < price && discountPercent > 0;

  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className="text-lg font-bold text-ink">{formatPrice(discountedPrice, currency, locale)}</span>
      {hasPriceDrop && <span className="text-sm text-muted line-through">{formatPrice(price, currency, locale)}</span>}
      {hasPriceDrop && <span className="text-xs font-bold text-coral">{t("product.discountOff", { percent: discountPercent })}</span>}
    </div>
  );
}
