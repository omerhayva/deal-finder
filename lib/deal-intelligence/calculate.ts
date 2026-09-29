import { DealSummary, DealConfidence, DealInsight } from "./types";
import type { Product } from "../types";

/**
 * Bir üründen, eldeki verilerle hesaplanabilecek
 * DealSummary ve DealInsight oluşturur.
 *
 * Sadece eldeki verilerden beslenir; eksik veride boş/undefined bırakır.
 * Gerçek fiyat geçmişi, rekabetçi fiyat, doğrulama yöntemi gibi
 * veriler yoksa bunları uydurma.
 */

export function buildDealInsight(product: Product): DealInsight {
  const summary: DealSummary = {
    originalPrice: product.price,
    discountedPrice: product.discountedPrice,
    discountPercent: product.discountPercent,
    couponCode: product.couponCode ?? undefined,
    expiresAt: product.expiresAt ?? undefined,
    verifiedAt: product.verifiedAt,
  };

  const confidence = assessConfidence(product);

  const savings = (product.price > 0 && product.discountedPrice > 0)
    ? product.price - product.discountedPrice
    : 0;

  return {
    summary,
    confidence,
    savingsAmount: savings || undefined,
    priceHistoryAvailable: false,
    competitorPriceAvailable: false,
    verificationMethodAvailable: false,
  };
}

/** DealConfidence belirleme */

function assessConfidence(product: Product): DealConfidence {
  if (product.price == null || product.discountedPrice == null) {
    return "unknown";
  }
  if (typeof product.discountPercent !== "number" || !Number.isFinite(product.discountPercent)) {
    return "insufficient_data";
  }
  if (product.discountPercent > 0 && product.price > 0) {
    return "verified_discount";
  }
  return "insufficient_data";
}

/** Saf hesaplama fonksiyonları */

/**
 * İndirim yüzdesini hesaplar.
 * Orijinal veya indirimli fiyat eksik/yanlışsa null döner.
 * Sonuç 1 ondalık basamak yuvarlanır.
 */
export function calculateDiscountPercent(
  originalPrice: number,
  discountedPrice: number,
): number | null {
  if (originalPrice == null || discountedPrice == null) return null;
  if (!Number.isFinite(originalPrice) || !Number.isFinite(discountedPrice)) return null;
  if (originalPrice <= 0) return null;
  if (discountedPrice < 0) return null;
  if (discountedPrice > originalPrice) return null;
  const raw = ((originalPrice - discountedPrice) / originalPrice) * 100;
  return Math.round(raw * 10) / 10;
}

/**
 * Nominal tasarruf (orijinal − indirimli).
 * Eksik/negatif girişlerde 0 döner.
 */
export function calculateSavingsAmount(
  originalPrice: number,
  discountedPrice: number,
): number {
  if (originalPrice == null || discountedPrice == null) return 0;
  if (!Number.isFinite(originalPrice) || !Number.isFinite(discountedPrice)) return 0;
  if (originalPrice < 0 || discountedPrice < 0) return 0;
  return Math.max(0, originalPrice - discountedPrice);
}
