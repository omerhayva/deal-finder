"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function SearchBar({ initialValue = "", compact = false }: { initialValue?: string; compact?: boolean }) {
  const [query, setQuery] = useState(initialValue);
  const router = useRouter();
  const submit = (event: FormEvent) => { event.preventDefault(); const value = query.trim(); router.push(value ? `/search?q=${encodeURIComponent(value)}` : "/search"); };
  return <form onSubmit={submit} className={`flex w-full ${compact ? "max-w-xl" : "max-w-2xl"}`}>
    <label className="flex min-h-14 flex-1 items-center rounded-l-2xl border border-r-0 border-ink/15 bg-white px-5 shadow-soft focus-within:border-ink/40"><span className="mr-3 text-xl text-muted">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="What are you looking for?" className="w-full bg-transparent text-base outline-none placeholder:text-muted/70" /></label>
    <button className="rounded-r-2xl bg-coral px-5 text-sm font-semibold text-white transition hover:bg-ink sm:px-8">Search</button>
  </form>;
}
