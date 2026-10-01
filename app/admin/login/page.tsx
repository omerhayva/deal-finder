import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "./LoginForm";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin/auth";
import { LocalizedText } from "@/components/LocalizedText";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const configured = isAdminConfigured();
  if (configured && await isAdminAuthenticated()) redirect("/admin/products");

  return (
    <section className="container-shell flex min-h-[65vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-3xl border border-ink/10 bg-white p-7 shadow-soft sm:p-9">
        <p className="eyebrow">DealFinder</p>
        <h1 className="mt-3 font-display text-4xl tracking-tight"><LocalizedText id="admin.loginTitle" /></h1>
        <p className="mt-3 text-sm leading-6 text-muted"><LocalizedText id="admin.loginDescription" /></p>
        <LoginForm configured={configured} />
      </div>
    </section>
  );
}
