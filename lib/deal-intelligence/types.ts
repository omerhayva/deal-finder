/**
 * Deal Intelligence types.
 *
 * Bu modül, ürünün "gerçekten iyi bir fırsat olup olmadığını"
 * değerlendirmek için ihtiyaç duyulan veri yüzeyini tanımlar.
 *
 * Mevcut katalogda fiyat geçmişi, rakip fiyatları veya bağımsız doğrulama
 * verisi tutulmuyor. Satıcı bildirimleri bağımsız doğrulanmış gibi sunulmamalıdır.
 */

/**
 * Bir ürünün fiyat/kupon özeti.
 * Mevcut katalog kayıtlarından türetilebilen alanlar burada toplanır.
 */
export type DealSummary = {
  /** Fiyatı (mock veride price) */
  originalPrice: number;
  /** İndirimli fiyat (mock veride discountedPrice) */
  discountedPrice: number;
  /** İndirim yüzdesi (mock veride discountPercent) */
  discountPercent: number;
  /** Kupon kodu (varsa) */
  couponCode?: string;
  /** Kuponun geçerlilik tarihi (varsa) */
  expiresAt?: string;
  /** Ürünün yayına alınma tarihi */
  publishedAt: string;
};

/**
 * Bir fırsatın "güvenilirlik/önem" durum bilgisi.
 * Yapay 0–100 skor yerine bu kullanılır; gerçek veri yoksa belirsizlik
 * açıkça gösterilir.
 */
export type DealConfidence =
  /** Hiçbir veri yok — değerlendirme yapılamaz */
  | "unknown"
  /** İndirim hesaplanabilir ancak fiyat satıcı tarafından bildirilmiş; bağımsız doğrulama yok */
  | "seller_reported_discount"
  /** Karşılaştırma/veri eksik; indirim doğruluğu değerlendirilemiyor */
  | "insufficient_data"
  /** Doğrulanmış indirim — güncel fiyat ve orijinal fiyat var */
  | "verified_discount"
  /** Fiyat geçmişi mevcut ve güncel fiyat tarihsel minimumdan düşük (gerçek veri gerekli) */
  | "verified_historical_low";

/**
 * Bir ürüne ilişkin düşünce özeti.
 * Mevcut veriyle hesaplanabilenler burada toplanır.
 */
export type DealInsight = {
  /** Mevcut path economics — eldeki verilerle sweet */
  summary: DealSummary;
  /** Mevcut verinin ne kadar anlamlı olduğu */
  confidence: DealConfidence;
  /**
   * Nominal tasarruf (orijinal - indirimli).
   * Eğer originalPrice veya discountedPrice eksikse 0 veya null olabilir.
   */
  savingsAmount?: number;
  /**
   * Gerçek fiyat geçmişi mevcut mu?
   * Şu an mock veride yoktur. Gerçek veri geldiğinde true olabilir.
   */
  priceHistoryAvailable: false;
  /**
   * Rekabetçi fiyat bilgisi mevcut mu?
   * Şu an yoktur.
   */
  competitorPriceAvailable: false;
  /**
   * Doğrulama yöntemi bilgisi.
   * Şu an yoktur.
   */
  verificationMethodAvailable: false;
};
