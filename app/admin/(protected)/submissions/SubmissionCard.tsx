"use client";

import type { Submission, SubmissionStatus } from "@/lib/submissions/types";
import { productCategoryValidate } from "@/lib/types";
import { useLanguage } from "@/components/LocaleProvider";
import { translateCategory, type MessageKey } from "@/lib/i18n/messages";

const STATUS_BADGE: Record<SubmissionStatus, { label: MessageKey; className: string }> = {
  pending: { label: "admin.statusPending", className: "bg-yellow-100 text-yellow-800" },
  approved: { label: "admin.statusApproved", className: "bg-green-100 text-green-800" },
  rejected: { label: "admin.statusRejected", className: "bg-red-100 text-red-800" },
};

function formatSubmissionDate(value: string, locale: "en" | "tr", withTime = false): string {
  return new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(new Date(value));
}

export function SubmissionCard({
  submission,
  onApprove,
  onReject,
  isProcessing = false,
}: {
  submission: Submission;
  onApprove: () => void;
  onReject: () => void;
  isProcessing?: boolean;
}) {
  const { locale, t } = useLanguage();
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
              {translateCategory(locale, productCategoryValidate(submission.category))}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusInfo.className}`}
            >
              {t(statusInfo.label)}
            </span>
          </div>
          <h3 className="line-clamp-2 min-h-[3rem] text-lg font-semibold leading-7 text-ink">
            {submission.title}
          </h3>
          <p className="text-sm text-muted line-clamp-2">
            {submission.description ?? t("admin.noDescription")}
          </p>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid gap-3 border-t border-ink/10 p-5 sm:grid-cols-2">
        <div>
          <p className="text-xs text-muted">{t("admin.shop")}</p>
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
          <p className="text-xs text-muted">{t("admin.product")}</p>
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
            <p className="text-xs text-muted">{t("admin.originalPrice")}</p>
            <p className="mt-1 font-semibold">${submission.originalPrice.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-muted">{t("admin.discountedPrice")}</p>
            <p className="mt-1 font-semibold text-coral">${submission.discountedPrice.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-muted">{t("admin.discount")}</p>
            <span className="rounded-full bg-coral/10 px-2 py-0.5 text-xs font-semibold text-coral">
              {t("admin.discountValue", { percent: discountPct })}
            </span>
          </div>
        </div>
        {submission.couponCode && (
          <div className="rounded-xl border border-coral/20 bg-[#fff7f3] p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-coral">{t("admin.couponCode")}</p>
            <p className="mt-1 font-bold text-ink">{submission.couponCode}</p>
          </div>
        )}
        {submission.expiresAt && (
          <div className="rounded-xl bg-white p-3">
            <p className="text-xs text-muted">{t("admin.expiryDate")}</p>
            <p className="mt-1 font-semibold">{submission.expiresAt}</p>
          </div>
        )}
        <div className="col-span-2 rounded-xl bg-white p-3">
          <p className="text-xs text-muted">{t("admin.categoryField")}</p>
          <p className="mt-1 font-semibold">{translateCategory(locale, productCategoryValidate(submission.category))}</p>
        </div>
        <div className="col-span-2 rounded-xl bg-white p-3">
          <p className="text-xs text-muted">{t("admin.submissionDate")}</p>
          <p className="mt-1 font-semibold">{formatSubmissionDate(submission.createdAt, locale, true)}</p>
        </div>
      </div>

      {/* Actions */}
      {submission.status === "pending" && (
        <div className="flex gap-3 border-t border-ink/10 p-5">
          <button
            onClick={onReject}
            disabled={isProcessing}
            className="flex-1 rounded-full border border-red-200 bg-red-50 py-3 text-sm font-semibold text-red-700 transition hover:border-red-400 hover:bg-red-100 disabled:cursor-wait disabled:opacity-60"
          >
            {isProcessing ? t("admin.processing") : t("admin.reject")}
          </button>
          <button
            onClick={onApprove}
            disabled={isProcessing}
            className="flex-1 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-coral disabled:cursor-wait disabled:opacity-60"
          >
            {isProcessing ? t("admin.processing") : t("admin.approve")}
          </button>
        </div>
      )}
      {submission.status !== "pending" && (
        <div className="flex items-center gap-2 border-t border-ink/10 p-4">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.className}`}>
            {t(statusInfo.label)}
          </span>
          <span className="text-xs text-muted">
            {t("admin.lastStatus")}: {formatSubmissionDate(submission.createdAt, locale)}
          </span>
        </div>
      )}
    </article>
  );
}
