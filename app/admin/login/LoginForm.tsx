"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/app/actions/admin-auth";
import { useLanguage } from "@/components/LocaleProvider";

export function LoginForm({ configured }: { configured: boolean }) {
  const { t } = useLanguage();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    try {
      const result = await loginAdmin(password);
      if (!result.configured) {
        setError(t("admin.notConfigured"));
      } else if (!result.ok) {
        setError(t("admin.loginError"));
      } else {
        router.replace("/admin/products");
        router.refresh();
      }
    } catch {
      setError(t("admin.loginError"));
    } finally {
      setPending(false);
    }
  }

  if (!configured) {
    return <p role="status" className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">{t("admin.notConfigured")}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <label className="block">
        <span className="mb-2 block text-sm font-semibold">{t("admin.password")}</span>
        <input
          autoComplete="current-password"
          required
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-xl border border-ink/15 bg-canvas px-4 py-3 text-sm outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/10"
        />
      </label>
      {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      <button type="submit" disabled={pending} className="button-primary w-full disabled:cursor-wait disabled:opacity-60">
        {pending ? t("admin.signingIn") : t("admin.signIn")}
      </button>
    </form>
  );
}
