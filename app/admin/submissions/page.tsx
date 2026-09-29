"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { SubmissionCard } from "./SubmissionCard";
import type { Submission } from "@/lib/submissions";
import {
  getAllSubmissions,
  approveSubmission,
  rejectSubmission,
  createProductFromSubmission,
} from "@/app/actions/submissions";

const FILTERS = [
  { value: "all", label: "Hepsi" },
  { value: "pending", label: "Beklemede" },
  { value: "approved", label: "Onaylı" },
  { value: "rejected", label: "Reddedildi" },
] as const;

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const all = await getAllSubmissions();
      if (!cancelled) {
        setSubmissions(all);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return submissions;
    return submissions.filter((s) => s.status === filter);
  }, [submissions, filter]);

  const handleAction = useCallback(
    async (id: string, status: "approved" | "rejected") => {
      setSubmittingId(id);
      try {
        if (status === "approved") {
          await approveSubmission(id);
          // Fetch the submission to create the product from it
          const submission = await getAllSubmissions().then((all) =>
            all.find((s) => s.id === id)
          );
          if (submission) {
            await createProductFromSubmission(submission);
          }
        } else {
          await rejectSubmission(id);
        }
        const updated = await getAllSubmissions();
        setSubmissions(updated);
      } finally {
        setSubmittingId(null);
      }
    },
    [],
  );

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-10">
        <h1 className="font-display text-4xl tracking-tight sm:text-5xl">
          Gönderiler
        </h1>
        <p className="mt-3 text-lg text-muted">
          Etsy satıcıları tarafından gönderilen fırsatları inceleyin ve
          onaylayın.
        </p>
      </header>

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
            {f.label}
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
            Görünümde bulunabilecek gönderi yok.
          </p>
          <p className="mt-1 text-sm text-muted">
            Filtrelenmiş gösterimde veya genel listede hiç gönderi yok.
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
            />
          ))}
        </div>
      )}
    </div>
  );
}