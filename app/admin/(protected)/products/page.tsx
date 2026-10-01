"use client";

import { useState, useEffect, useCallback } from "react";
import {
  createProduct,
  getAllProducts,
  updateProductStatus,
  type CreateProductInput,
} from "@/app/actions/products";
import type { Product } from "@/lib/products/types";
import { useLanguage } from "@/components/LocaleProvider";
import { translateCategory } from "@/lib/i18n/messages";
import { PRODUCT_CATEGORIES } from "@/lib/types";

const CATEGORIES = [...PRODUCT_CATEGORIES, "General"] as const;

export default function AdminProductsPage() {
  const { locale, t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [actionStatus, setActionStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Form state
  const [form, setForm] = useState<CreateProductInput>({
    title: "",
    description: undefined,
    imageUrl: undefined,
    shopName: "",
    productUrl: "",
    category: "General",
    originalPrice: 0,
    discountedPrice: 0,
    currency: "USD",
    couponCode: undefined,
    expiresAt: undefined,
    source: undefined,
    sourceId: undefined,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const all = await getAllProducts();
        if (!cancelled) setProducts(all);
      } catch {
        if (!cancelled) setActionStatus({ type: "error", message: t("admin.productsLoadFailed") });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [t]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
      setActionStatus(null);

      try {
        const result = await createProduct(form);
        if (result.success && result.product) {
          setProducts((prev) => [result.product!, ...prev]);
          setActionStatus({ type: "success", message: t("admin.productAdded") });
          setForm({
            title: "",
            description: undefined,
            imageUrl: undefined,
            shopName: "",
            productUrl: "",
            category: "General",
            originalPrice: 0,
            discountedPrice: 0,
            currency: "USD",
            couponCode: undefined,
            expiresAt: undefined,
            source: undefined,
            sourceId: undefined,
          });
        } else {
          setActionStatus({ type: "error", message: result.error || t("admin.productAddFailed") });
        }
      } catch {
        setActionStatus({ type: "error", message: t("admin.productAddRetry") });
      } finally {
        setSubmitting(false);
      }
    },
    [form, t]
  );

  const handleStatusChange = useCallback(
    async (id: string, status: "approved" | "rejected" | "expired") => {
      try {
        const ok = await updateProductStatus(id, status);
        if (ok) {
          setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
          setActionStatus({ type: "success", message: t("admin.productStatusUpdated") });
        } else {
          setActionStatus({ type: "error", message: t("admin.productStatusUpdateFailed") });
        }
      } catch {
        setActionStatus({ type: "error", message: t("admin.productStatusRetry") });
      }
    },
    [t]
  );

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-10">
        <h1 className="font-display text-4xl tracking-tight sm:text-5xl">
          {t("admin.productManagementTitle")}
        </h1>
        <p className="mt-3 text-lg text-muted">
          {t("admin.productsIntro")}
        </p>
      </header>

      {actionStatus && (
        <div
          className={`mb-8 rounded-xl p-4 text-sm ${
            actionStatus.type === "success"
              ? "border border-green-200 bg-green-50 text-green-900"
              : "border border-red-200 bg-red-50 text-red-900"
          }`}
        >
          {actionStatus.message}
        </div>
      )}

      {/* Add product form */}
      <form
        onSubmit={handleSubmit}
        className="mb-12 rounded-3xl border border-ink/10 bg-white p-6 shadow-soft sm:p-8"
      >
        <h2 className="text-xl font-semibold">{t("admin.newProduct")}</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="mb-2 block text-sm font-semibold">{t("admin.productTitleField")}</span>
            <input
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              type="text"
              placeholder={t("admin.productTitlePlaceholder")}
              className="w-full rounded-xl border border-ink/15 bg-canvas px-4 py-3 text-sm outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/10"
            />
          </label>

          <label className="sm:col-span-2">
            <span className="mb-2 block text-sm font-semibold">{t("admin.shopNameField")}</span>
            <input
              required
              value={form.shopName}
              onChange={(e) => setForm((f) => ({ ...f, shopName: e.target.value }))}
              type="text"
              placeholder={t("admin.shopNamePlaceholder")}
              className="w-full rounded-xl border border-ink/15 bg-canvas px-4 py-3 text-sm outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/10"
            />
          </label>

          <label className="sm:col-span-2">
            <span className="mb-2 block text-sm font-semibold">{t("admin.productUrlField")}</span>
            <input
              required
              value={form.productUrl}
              onChange={(e) => setForm((f) => ({ ...f, productUrl: e.target.value }))}
              type="url"
              placeholder="https://www.etsy.com/listing/123456789"
              className="w-full rounded-xl border border-ink/15 bg-canvas px-4 py-3 text-sm outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/10"
            />
          </label>

          <label>
            <span className="mb-2 block text-sm font-semibold">{t("admin.imageUrlField")}</span>
            <input
              value={form.imageUrl || ""}
              onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value || undefined }))}
              type="url"
              placeholder="https://..."
              className="w-full rounded-xl border border-ink/15 bg-canvas px-4 py-3 text-sm outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/10"
            />
          </label>

          <label>
            <span className="mb-2 block text-sm font-semibold">{t("admin.categoryField")}</span>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full rounded-xl border border-ink/15 bg-canvas px-4 py-3 text-sm outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/10"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {translateCategory(locale, c)}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-2 block text-sm font-semibold">{t("admin.originalPriceField")}</span>
            <input
              required
              type="number"
              step="0.01"
              min="0.01"
              value={form.originalPrice || ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  originalPrice: parseFloat(e.target.value) || 0,
                }))
              }
              placeholder="0.00"
              className="w-full rounded-xl border border-ink/15 bg-canvas px-4 py-3 text-sm outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/10"
            />
          </label>

          <label>
            <span className="mb-2 block text-sm font-semibold">{t("admin.discountedPriceField")}</span>
            <input
              required
              type="number"
              step="0.01"
              min="0"
              value={form.discountedPrice || ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  discountedPrice: parseFloat(e.target.value) || 0,
                }))
              }
              placeholder="0.00"
              className="w-full rounded-xl border border-ink/15 bg-canvas px-4 py-3 text-sm outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/10"
            />
          </label>

          <label>
            <span className="mb-2 block text-sm font-semibold">{t("admin.couponField")}</span>
            <input
              value={form.couponCode || ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  couponCode: e.target.value || undefined,
                }))
              }
              type="text"
              placeholder={t("admin.couponPlaceholder")}
              className="w-full rounded-xl border border-ink/15 bg-canvas px-4 py-3 text-sm outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/10"
            />
          </label>

          <label>
            <span className="mb-2 block text-sm font-semibold">{t("admin.expiresField")}</span>
            <input
              value={form.expiresAt || ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  expiresAt: e.target.value || undefined,
                }))
              }
              type="date"
              className="w-full rounded-xl border border-ink/15 bg-canvas px-4 py-3 text-sm outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/10"
            />
          </label>

          <label className="sm:col-span-2">
            <span className="mb-2 block text-sm font-semibold">{t("admin.descriptionField")}</span>
            <textarea
              value={form.description || ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  description: e.target.value || undefined,
                }))
              }
              rows={3}
              placeholder={t("admin.descriptionPlaceholder")}
              className="w-full rounded-xl border border-ink/15 bg-canvas px-4 py-3 text-sm outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/10"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-8 w-full button-primary disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {submitting ? t("admin.addingProduct") : t("admin.addProductButton")}
          <span className="ml-2">→</span>
        </button>
      </form>

      {/* Products list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink/20 border-t-ink" />
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-ink/10 bg-white p-12 text-center">
          <p className="text-lg font-semibold text-ink">{t("admin.noProducts")}</p>
          <p className="mt-1 text-sm text-muted">
            {t("admin.noProductsHint")}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {products.map((product) => (
            <div
              key={product.id}
              className="overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-soft"
            >
              <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start">
                {product.image && (
                   <div className="h-32 w-40 overflow-hidden rounded-xl bg-mint sm:h-24 sm:w-40">
                     <img
                       src={product.image}
                      alt={product.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                      {product.category}
                    </span>
                  </div>
                  <h3 className="line-clamp-2 min-h-[3rem] text-lg font-semibold leading-7 text-ink">
                    {product.title}
                  </h3>
                  <p className="text-sm text-muted line-clamp-2">
                    {product.description ?? t("admin.noDescription")}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 border-t border-ink/10 p-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted">{t("admin.shop")}</p>
                  <p className="mt-1 font-semibold">{product.shop}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">{t("admin.productUrl")}</p>
                  <a
                    href={product.etsyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-coral hover:text-ink break-all"
                  >
                    {product.etsyUrl}
                    <span className="ml-1">↗</span>
                  </a>
                </div>
                <div className="flex gap-4">
                  <div>
                    <p className="text-xs text-muted">{t("admin.originalPrice")}</p>
                    <p className="mt-1 font-semibold">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">{t("admin.discountedPrice")}</p>
                    <p className="mt-1 font-semibold text-coral">
                      ${product.discountedPrice.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">{t("admin.discount")}</p>
                    <span className="rounded-full bg-coral/10 px-2 py-0.5 text-xs font-semibold text-coral">
                      {t("admin.discountValue", { percent: product.discountPercent })}
                    </span>
                  </div>
                </div>
                {product.couponCode && (
                  <div className="rounded-xl border border-coral/20 bg-[#fff7f3] p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-coral">
                      {t("admin.couponCode")}
                    </p>
                    <p className="mt-1 font-bold text-ink">{product.couponCode}</p>
                  </div>
                )}
                {product.expiresAt && (
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-xs text-muted">{t("admin.expiryDate")}</p>
                    <p className="mt-1 font-semibold">{product.expiresAt}</p>
                  </div>
                )}
                <div className="col-span-2 rounded-xl bg-white p-3">
                  <p className="text-xs text-muted">{t("admin.productId")}</p>
                  <p className="mt-1 font-semibold font-mono text-sm">{product.id}</p>
                </div>
                <div className="col-span-2 flex gap-2">
                  {product.status === "approved" && (
                    <button
                      onClick={() => handleStatusChange(product.id, "expired")}
                      className="flex-1 rounded-full border border-ink/10 bg-white py-2 text-sm font-semibold text-ink transition hover:bg-ink/5"
                    >
                      {t("admin.markExpired")}
                    </button>
                  )}
                  {product.status === "expired" && (
                    <button
                      onClick={() => handleStatusChange(product.id, "approved")}
                      className="flex-1 rounded-full border border-green-200 bg-green-50 py-2 text-sm font-semibold text-green-700 transition hover:border-green-400 hover:bg-green-100"
                    >
                      {t("admin.makeActive")}
                    </button>
                  )}
                  {product.status === "approved" && (
                    <button
                      onClick={() => handleStatusChange(product.id, "rejected")}
                      className="flex-1 rounded-full border border-red-200 bg-red-50 py-2 text-sm font-semibold text-red-700 transition hover:border-red-400 hover:bg-red-100"
                    >
                      {t("admin.rejectProduct")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
