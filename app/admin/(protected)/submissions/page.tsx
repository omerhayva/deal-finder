"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { SubmissionCard } from "./SubmissionCard";
import type { Submission } from "@/lib/submissions/types";
import { getAllSubmissions, approveSubmission, rejectSubmission } from "@/app/actions/submissions";
import { useLanguage } from "@/components/LocaleProvider";
import type { MessageKey } from "@/lib/i18n/messages";

const FILTERS: { value: string; label: MessageKey }[] = [
  { value: "all", label: "admin.filterAll" },
  { value: "pending", label: "admin.filterPending" },
  { value: "approved", label: "admin.filterApproved" },
  { value: "rejected", label: "admin.filterRejected" },
];

export default function AdminSubmissionsPage() {
  const { t } = useLanguage();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const all = await getAllSubmissions();
        if (!cancelled) setSubmissions(all);
      } catch {
        if (!cancelled) setActionError(t("admin.submissionsLoadFailed"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [t]);

  const filtered = useMemo(() => {
    if (filter === "all") return submissions;
    return submissions.filter((s) => s.status === filter);
  }, [submissions, filter]);

  const handleAction = useCallback(
    async (id: string, status: "approved" | "rejected") => {
      setSubmittingId(id);
      setActionError(null);
      try {
        if (status === "approved") {
          const result = await approveSubmission(id);
          if (!result.success) throw new Error(t("admin.approvalFailed"));
        } else if (!(await rejectSubmission(id))) {
          throw new Error(t("admin.rejectionFailed"));
        }
        setSubmissions(await getAllSubmissions());
      } catch (error) {
        setActionError(error instanceof Error ? error.message : t("admin.actionFailed"));
      } finally {
        setSubmittingId(null);
      }
    },
    [t],
  );

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-10">
        <h1 className="font-display text-4xl tracking-tight sm:text-5xl">
          {t("admin.submissionsTitle")}
        </h1>
        <p className="mt-3 text-lg text-muted">
          {t("admin.submissionsIntro")}
        </p>
      </header>

      {actionError && <p role="alert" className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-800">{actionError}</p>}

      <nav className="mb-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              filter === f.value
                ? "bg-ink text-white"
                : "bg-white text-ink/80 hover:bg-ink/5 border border-ink/10"
            }`}
          >
            {t(f.label)}
          </button>
        ))}
      </nav>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink/20 border-t-ink" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-ink/10 bg-white p-12 text-center">
          <p className="text-lg font-semibold text-ink">
            {t("admin.noSubmissions")}
          </p>
          <p className="mt-1 text-sm text-muted">
            {t("admin.noSubmissionsHint")}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {filtered.map((submission) => (
            <SubmissionCard
              key={submission.id}
              submission={submission}
              onApprove={() => handleAction(submission.id, "approved")}
              onReject={() => handleAction(submission.id, "rejected")}
              isProcessing={submittingId === submission.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}