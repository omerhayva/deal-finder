/**
 * Submission veri modeli.
 * Satıcıların Etsy ürün/fırsat göndermesini sağlar.
 */

/** Gönderi durumları */
export type SubmissionStatus = "pending" | "approved" | "rejected";

/** Bir gönderi (submission) */
export type Submission = {
  id: string;
  sellerShopUrl: string;
  productUrl: string;
  title: string;
  imageUrl?: string;
  originalPrice: number;
  discountedPrice: number;
  couponCode?: string;
  expiresAt?: string;
  category: string;
  description?: string;
  status: SubmissionStatus;
  createdAt: string; // ISO 8601
  approvedAt?: string; // first approval starts the seller's free trial
  consentAcceptedAt?: string; // ISO 8601; recorded when the seller accepts the submission terms
};

/** Geçerli kategori değerleri (mock veriyle tutarl) */
export type SubmissionCategory =
  | "Wedding"
  | "Home Decor"
  | "Digital Products"
  | "Gifts"
  | "Jewelry"
  | "Clothing"
  | "Printable"
  | "Wall Art"
  | "General";
