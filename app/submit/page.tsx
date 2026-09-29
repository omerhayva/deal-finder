"use client";

import { type FormEvent, useState, useCallback } from "react";
import {
  validateSubmission,
  createSubmission,
} from "@/lib/submissions";
import { submitSubmission } from "@/app/actions/submissions";

export default function SubmitPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsSubmitting(true);
      setErrors([]);

      const form = event.currentTarget;
      const fd = new FormData(form);

      const input = {
        sellerShopUrl: (fd.get("sellerShopUrl") as string) || "",
        productUrl: (fd.get("productUrl") as string) || "",
        title: (fd.get("title") as string) || "",
        imageUrl: (fd.get("imageUrl") as string) || undefined,
        originalPrice: (fd.get("originalPrice") as string) || "",
        discountedPrice: (fd.get("discountedPrice") as string) || "",
        couponCode: (fd.get("couponCode") as string) || undefined,
        expiresAt: (fd.get("expiresAt") as string) || undefined,
        category: (fd.get("category") as string) || "",
        description: (fd.get("description") as string) || undefined,
      };

      const result = validateSubmission(input);

      if (!result.ok) {
        const messages: Record<string, string> = {
          shopUrl_invalid: "Lütfen geçerli bir Etsy mağaza URL'si girin.",
          productUrl_invalid: "Lütfen geçerli bir Etsy ürün URL'si girin.",
          title_empty: "Ürün başlığı zorunludur.",
          originalPrice_invalid:
            "Lütfen geçerli ve pozitif bir normal fiyat girin.",
          discountedPrice_invalid:
            "Lütfen geçerli bir indirimli fiyat girin.",
          discountedPrice_gt_original:
            "İndirimli fiyat, normal fiyatın üzerinde olamaz.",
          category_invalid: "Lütfen geçerli bir kategori seçin.",
        };

        setErrors(
          result.errors.map(
            (e) => messages[e] || "Beklenmeyen bir hata oluştu.",
          ),
        );
        setIsSubmitting(false);
        return;
      }

      try {
        const submission = createSubmission(result.data);
        const saveResult = await submitSubmission(submission);

        if (!saveResult.success) {
          setErrors([
            saveResult.error ??
              "Gönderi kaydedilemedi. Lütfen tekrar deneyin.",
          ]);
          return;
        }

        setSubmissionId(submission.id);
        setSubmitted(true);
        form.reset();
      } catch {
        setErrors([
          "Gönderi kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.",
        ]);
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  return (
    <section className="container-shell py-12 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow">Etsy satıcıları için</p>

        <h1 className="mt-4 font-display text-5xl tracking-tight sm:text-6xl">
          Bir fırsat gönder.
        </h1>

        <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
          Etsy mağazandaki indirimli ürün veya aktif kuponu keşfedilmeye değer
          kıl.
        </p>

        {submitted ? (
          <div className="mt-10 rounded-2xl border border-green-200 bg-green-50 p-6 text-green-900">
            <p className="font-semibold">
              Gönderin incelemeye alınmıştır.
            </p>

            {submissionId && (
              <p className="mt-1 text-sm">
                Referans numaranız:{" "}
                <span className="font-mono">{submissionId}</span>
              </p>
            )}

            <p className="mt-1 text-sm">
              Ekibimiz tarafından onaylandıktan sonra ürünün katalogda yer
              alacaktır.
            </p>

            <button
              onClick={() => setSubmitted(false)}
              className="mt-5 text-sm font-semibold underline"
            >
              Başka bir fırsat gönder
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-10 rounded-3xl bg-white p-6 shadow-soft sm:p-10"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="mb-2 block text-sm font-semibold">
                  Etsy Mağaza URL'si *
                </span>
                <input
                  required
                  name="sellerShopUrl"
                  type="url"
                  placeholder="https://example.com/shop/shop-name"
                  className="w-full rounded-xl border border-ink/15 bg-canvas px-4 py-3 text-sm outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/10"
                />
              </label>

              <label className="sm:col-span-2">
                <span className="mb-2 block text-sm font-semibold">
                  Etsy Ürün URL'si *
                </span>
                <input
                  required
                  name="productUrl"
                  type="url"
                  placeholder="https://www.etsy.com/listing/123456789"
                  className="w-full rounded-xl border border-ink/15 bg-canvas px-4 py-3 text-sm outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/10"
                />
              </label>

              <label className="sm:col-span-2">
                <span className="mb-2 block text-sm font-semibold">
                  Ürün Başlığı *
                </span>
                <input
                  required
                  name="title"
                  type="text"
                  placeholder="Örnek: Minimalist Düğün Davetiye Seti"
                  className="w-full rounded-xl border border-ink/15 bg-canvas px-4 py-3 text-sm outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/10"
                />
              </label>

              <label>
                <span className="mb-2 block text-sm font-semibold">
                  Görsel URL (opsiyonel)
                </span>
                <input
                  name="imageUrl"
                  type="url"
                  placeholder="https://..."
                  className="w-full rounded-xl border border-ink/15 bg-canvas px-4 py-3 text-sm outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/10"
                />
              </label>

              <label>
                <span className="mb-2 block text-sm font-semibold">
                  Kategori *
                </span>
                <select
                  name="category"
                  required
                  className="w-full rounded-xl border border-ink/15 bg-canvas px-4 py-3 text-sm outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/10"
                >
                  <option value="">Kategori seçin</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Home Decor">Home Decor</option>
                  <option value="Digital Products">Digital Products</option>
                  <option value="Gifts">Gifts</option>
                  <option value="Jewelry">Jewelry</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Printable">Printable</option>
                  <option value="Wall Art">Wall Art</option>
                </select>
              </label>

              <label>
                <span className="mb-2 block text-sm font-semibold">
                  Normal Fiyat (USD) *
                </span>
                <input
                  required
                  name="originalPrice"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  className="w-full rounded-xl border border-ink/15 bg-canvas px-4 py-3 text-sm outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/10"
                />
              </label>

              <label>
                <span className="mb-2 block text-sm font-semibold">
                  İndirimli Fiyat (USD) *
                </span>
                <input
                  required
                  name="discountedPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="w-full rounded-xl border border-ink/15 bg-canvas px-4 py-3 text-sm outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/10"
                />
              </label>

              <label>
                <span className="mb-2 block text-sm font-semibold">
                  Kupon Kodu (opsiyonel)
                </span>
                <input
                  name="couponCode"
                  type="text"
                  placeholder="Örn: WELCOME20"
                  className="w-full rounded-xl border border-ink/15 bg-canvas px-4 py-3 text-sm outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/10"
                />
              </label>

              <label>
                <span className="mb-2 block text-sm font-semibold">
                  Bitiş Tarihi (opsiyonel)
                </span>
                <input
                  name="expiresAt"
                  type="date"
                  className="w-full rounded-xl border border-ink/15 bg-canvas px-4 py-3 text-sm outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/10"
                />
              </label>

              <label className="sm:col-span-2">
                <span className="mb-2 block text-sm font-semibold">
                  Kısa Açıklama (opsiyonel)
                </span>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Ürün hakkında kısa bilgi..."
                  className="w-full rounded-xl border border-ink/15 bg-canvas px-4 py-3 text-sm outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/10"
                />
              </label>
            </div>

            {errors.length > 0 && (
              <div className="mt-5 rounded-xl bg-red-50 p-4">
                <ul className="list-inside list-disc text-sm text-red-700">
                  {errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-8 w-full button-primary disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {isSubmitting ? "Gönderiliyor..." : "İnceleme için gönder"}
              <span className="ml-2">→</span>
            </button>

            <p className="mt-4 text-xs leading-5 text-muted">
              Gönderi ücretsizdir. Onaylandıktan sonra ürün DealFinder
              kataloğunda yer alacaktır.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
