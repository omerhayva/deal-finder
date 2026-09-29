"use client";

import { Submission, type SubmissionStatus } from "@/lib/submissions";
import { productCategoryValidate } from "@/lib/types";

const STATUS_BADGE: Record<SubmissionStatus, { label: string; className: string }> = {
  pending: { label: "Beklemede", className: "bg-yellow-100 text-yellow-800" },
  approved: { label: "Onaylı", className: "bg-green-100 text-green-800" },
  rejected: { label: "Reddedildi", className: "bg-red-100 text-red-800" },
};

export function SubmissionCard({
  submission,
  onApprove,
  onReject,
}: {
  submission: Submission;
  onApprove: () => void;
  onReject: () => void;
}) {
  const statusInfo = STATUS_BADGE[submission.status];
  const discountPct =
    submission.originalPrice > 0
      ? Math.round(
          ((submission.originalPrice - submission.discountedPrice) /
            submission.originalPrice) *
            100
        )
      : 0;

  return (
    <article className="overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-soft transition hover:-translate-y-1">
      {/* Header: image + status + title */}
      <div className="flex flex-col gap-3 overflow-hidden p-5 sm:flex-row sm:items-start">
        {submission.imageUrl && (
          <div className="h-32 w-40 overflow-hidden rounded-xl bg-mint sm:h-24 sm:w-40">
            <img
              src={submission.imageUrl}
              alt={submission.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              {submission.category}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusInfo.className}`}
            >
              {statusInfo.label}
            </span>
          </div>
          <h3 className="line-clamp-2 min-h-[3rem] text-lg font-semibold leading-7 text-ink">
            {submission.title}
          </h3>
          <p className="text-sm text-muted line-clamp-2">
            {submission.description ?? "Açıklama yok."}
          </p>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid gap-3 border-t border-ink/10 p-5 sm:grid-cols-2">
        <div>
          <p className="text-xs text-muted">Mağaza</p>
          <a
            href={submission.sellerShopUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-coral hover:text-ink"
          >
            {submission.sellerShopUrl}
            <span className="ml-1">↗</span>
          </a>
        </div>
        <div>
          <p className="text-xs text-muted">Ürün</p>
          <a
            href={submission.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-coral hover:text-ink"
          >
            {submission.productUrl}
            <span className="ml-1">↗</span>
          </a>
        </div>
        <div className="flex gap-4">
          <div>
            <p className="text-xs text-muted">Normal Fiyat</p>
            <p className="mt-1 font-semibold">${submission.originalPrice.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-muted">İndirimli Fiyat</p>
            <p className="mt-1 font-semibold text-coral">${submission.discountedPrice.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-muted">İndirim</p>
            <span className="rounded-full bg-coral/10 px-2 py-0.5 text-xs font-semibold text-coral">
              %{discountPct} off
            </span>
          </div>
        </div>
        {submission.couponCode && (
          <div className="rounded-xl border border-coral/20 bg-[#fff7f3] p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-coral">Kupon Kodu</p>
            <p className="mt-1 font-bold text-ink">{submission.couponCode}</p>
          </div>
        )}
        {submission.expiresAt && (
          <div className="rounded-xl bg-white p-3">
            <p className="text-xs text-muted">Bitiş Tarihi</p>
            <p className="mt-1 font-semibold">{submission.expiresAt}</p>
          </div>
        )}
        <div className="col-span-2 rounded-xl bg-white p-3">
          <p className="text-xs text-muted">Kategori</p>
          <p className="mt-1 font-semibold">{productCategoryValidate(submission.category)}</p>
        </div>
        <div className="col-span-2 rounded-xl bg-white p-3">
          <p className="text-xs text-muted">Başvuru Tarihi</p>
          <p className="mt-1 font-semibold">{new Date(submission.createdAt).toLocaleDateString("tr-TR", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}</p>
        </div>
      </div>

      {/* Actions */}
      {submission.status === "pending" && (
        <div className="flex gap-3 border-t border-ink/10 p-5">
          <button
            onClick={onReject}
            className="flex-1 rounded-full border border-red-200 bg-red-50 py-3 text-sm font-semibold text-red-700 transition hover:border-red-400 hover:bg-red-100"
          >
            Reddet
          </button>
          <button
            onClick={onApprove}
            className="flex-1 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-coral"
          >
            Onayla
          </button>
        </div>
      )}
      {submission.status !== "pending" && (
        <div className="flex items-center gap-2 border-t border-ink/10 p-4">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.className}`}>
            {statusInfo.label}
          </span>
          <span className="text-xs text-muted">
            Son durum: {new Date(submission.createdAt).toLocaleDateString("tr-TR", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      )}
    </article>
  );
}
