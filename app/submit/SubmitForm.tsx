"use client";

import Link from "next/link";
import { type FormEvent, useCallback, useState } from "react";
import { submitSubmission } from "@/app/actions/submissions";
import { useLanguage } from "@/components/LocaleProvider";
import { LocalizedText } from "@/components/LocalizedText";
import { MarketplaceTabs } from "@/components/MarketplaceTabs";

export default function SubmitForm({ importConfigured }: { importConfigured: boolean }) {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [submissionTitle, setSubmissionTitle] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const consent = formData.get("consent") === "on";
    if (!consent) {
      setErrors([t("errors.consent")]);
      return;
    }

    setIsSubmitting(true);
    setErrors([]);
    try {
      const result = await submitSubmission({
        productUrl: String(formData.get("productUrl") ?? ""),
        couponCode: String(formData.get("couponCode") ?? "") || undefined,
        expiresAt: String(formData.get("expiresAt") ?? "") || undefined,
        consent,
        website: String(formData.get("website") ?? ""),
      });
      if (!result.success) {
        const messageByCode = {
          invalid: t("errors.productUrl"),
          consent_required: t("errors.consent"),
          temporarily_unavailable: t("submit.unavailable"),
          rate_limited: t("errors.rateLimited"),
          save_failed: t("errors.save"),
          import_unavailable: t("submit.importUnavailable"),
          listing_not_found: t("submit.listingNotFound"),
          billing_required: t("submit.billingRequired"),
        } as const;
        setErrors([result.errorCode ? messageByCode[result.errorCode] : t("errors.save")]);
        return;
      }

      setSubmissionId(result.id ?? null);
      setSubmissionTitle(result.title ?? null);
      setSubmitted(true);
      form.reset();
    } catch {
      setErrors([t("errors.save")]);
    } finally {
      setIsSubmitting(false);
    }
  }, [t]);

  return (
    <div className="mx-auto max-w-3xl">
      <p className="eyebrow"><LocalizedText id="submit.eyebrow" /></p>
      <h1 className="mt-4 font-display text-5xl tracking-tight sm:text-6xl"><LocalizedText id="submit.title" /></h1>
      <p className="mt-5 max-w-xl text-lg leading-8 text-muted"><LocalizedText id="submit.description" /></p>
      <div className="mt-8 flex justify-start">
        <MarketplaceTabs />
      </div>

      {!importConfigured && (
        <p role="status" className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <LocalizedText id="submit.importNotConfigured" />
        </p>
      )}

      {submitted ? (
        <div role="status" className="mt-10 rounded-2xl border border-green-200 bg-green-50 p-6 text-green-900">
          <p className="font-semibold"><LocalizedText id="submit.successTitle" /></p>
          {submissionTitle && <p className="mt-2 font-medium">{submissionTitle}</p>}
          {submissionId && <p className="mt-1 text-sm"><LocalizedText id="submit.reference" values={{ id: submissionId }} /></p>}
          <p className="mt-2 text-sm"><LocalizedText id="submit.successDescription" /></p>
          <button type="button" onClick={() => setSubmitted(false)} className="mt-5 text-sm font-semibold underline">
            <LocalizedText id="submit.another" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-10 rounded-3xl bg-white p-6 shadow-soft sm:p-10">
          <div className="hidden" aria-hidden="true">
            <label>Leave this field empty<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="mb-2 block text-sm font-semibold"><LocalizedText id="submit.productUrl" /> *</span>
              <input required name="productUrl" type="url" placeholder={t("submit.listingPlaceholder")} maxLength={2048} className="form-input" />
              <span className="mt-2 block text-xs leading-5 text-muted"><LocalizedText id="submit.importNote" /></span>
            </label>
            <label>
              <span className="mb-2 block text-sm font-semibold"><LocalizedText id="submit.coupon" /></span>
              <input name="couponCode" type="text" maxLength={80} placeholder={t("submit.couponPlaceholder")} className="form-input" />
            </label>
            <label>
              <span className="mb-2 block text-sm font-semibold"><LocalizedText id="submit.expires" /></span>
              <input name="expiresAt" type="date" className="form-input" />
            </label>
            <label className="sm:col-span-2 flex items-start gap-3 text-sm leading-6 text-muted">
              <input required name="consent" type="checkbox" className="mt-1 h-4 w-4 rounded border-ink/30 text-coral focus:ring-coral" />
              <span>{t("submit.consent")} <Link className="font-semibold text-coral underline" href="/terms">{t("footer.terms")}</Link> · <Link className="font-semibold text-coral underline" href="/privacy">{t("footer.privacy")}</Link></span>
            </label>
          </div>

          {errors.length > 0 && (
            <div role="alert" className="mt-5 rounded-xl bg-red-50 p-4">
              <ul className="list-inside list-disc text-sm text-red-700">{errors.map((error, index) => <li key={`${error}-${index}`}>{error}</li>)}</ul>
            </div>
          )}
          <button type="submit" disabled={isSubmitting || !importConfigured} className="button-primary mt-8 w-full disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">
            {isSubmitting ? t("submit.sending") : t("submit.button")} <span className="ml-2" aria-hidden="true">→</span>
          </button>
          <p className="mt-4 text-xs leading-5 text-muted"><LocalizedText id="submit.trialNote" /></p>
        </form>
      )}
    </div>
  );
}
