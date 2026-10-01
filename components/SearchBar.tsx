"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "./LocaleProvider";

export function SearchBar({ initialValue = "", compact = false }: { initialValue?: string; compact?: boolean }) {
  const [query, setQuery] = useState(initialValue);
  const router = useRouter();
  const { t } = useLanguage();

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/search?q=${encodeURIComponent(value)}` : "/search");
  };

  return (
    <form onSubmit={submit} role="search" className={`flex w-full ${compact ? "max-w-xl" : "max-w-2xl"}`}>
      <label className="flex min-h-14 flex-1 items-center rounded-l-2xl border border-r-0 border-ink/15 bg-white px-5 shadow-soft focus-within:border-ink/40">
        <span className="mr-3 text-xl text-muted" aria-hidden="true">⌕</span>
        <input
          aria-label={t("search.placeholder")}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("search.placeholder")}
          className="w-full bg-transparent text-base outline-none placeholder:text-muted/70"
        />
      </label>
      <button className="rounded-r-2xl bg-coral px-5 text-sm font-semibold text-white transition hover:bg-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 sm:px-8">
        {t("search.button")}
      </button>
    </form>
  );
}
