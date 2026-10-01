import type { Metadata } from "next";
import { LocalizedText } from "@/components/LocalizedText";
import { isSupabaseConfigured } from "@/lib/submissions/get-store";
import { isEtsyApiConfigured } from "@/lib/etsy-api";
import { getRequestLocale } from "@/lib/i18n/server";
import { translate } from "@/lib/i18n/messages";
import SubmitForm from "./SubmitForm";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return { title: translate(locale, "submit.title"), description: translate(locale, "submit.description") };
}

export default function SubmitPage() {
  const importConfigured = isEtsyApiConfigured();
  const submissionsAvailable = process.env.NODE_ENV !== "production" || (isSupabaseConfigured() && importConfigured);

  return (
    <section className="container-shell py-12 sm:py-20">
      {!submissionsAvailable ? (
        <div className="mx-auto max-w-3xl rounded-3xl border border-amber-200 bg-amber-50 p-8 text-amber-950">
          <h1 className="font-display text-3xl"><LocalizedText id="submit.unavailableTitle" /></h1>
          <p className="mt-3 leading-7"><LocalizedText id="submit.unavailable" /></p>
        </div>
      ) : (
        <SubmitForm importConfigured={importConfigured} />
      )}
    </section>
  );
}
