import type { Metadata } from "next";
import Link from "next/link";
import { LocalizedText } from "@/components/LocalizedText";
import { getRequestLocale } from "@/lib/i18n/server";
import { translate } from "@/lib/i18n/messages";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return { title: translate(locale, "about.eyebrow"), description: translate(locale, "about.intro") };
}

export default function AboutPage() {
  return (
    <div className="container-shell py-12 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow"><LocalizedText id="about.eyebrow" /></p>
        <h1 className="mt-4 font-display text-5xl tracking-tight sm:text-6xl"><LocalizedText id="about.title" /></h1>
        <p className="mt-6 text-lg leading-8 text-muted"><LocalizedText id="about.intro" /></p>
        <div className="mt-12 rounded-2xl border border-ink/10 bg-white p-8">
          <h2 className="font-display text-2xl tracking-tight"><LocalizedText id="about.purposeTitle" /></h2>
          <p className="mt-4 leading-7 text-muted"><LocalizedText id="about.purpose" /></p>
        </div>
        <div className="mt-10 rounded-2xl border border-ink/10 bg-white p-8">
          <h2 className="font-display text-2xl tracking-tight"><LocalizedText id="about.linksTitle" /></h2>
          <ol className="mt-5 list-inside list-decimal space-y-4 text-muted">
            <li><LocalizedText id="about.step1" /></li>
            <li><LocalizedText id="about.step2" /></li>
            <li><LocalizedText id="about.step3" /></li>
          </ol>
        </div>
        <div className="mt-10 rounded-2xl border border-ink/10 bg-white p-8">
          <h2 className="font-display text-2xl tracking-tight"><LocalizedText id="about.disclaimerTitle" /></h2>
          <p className="mt-4 leading-7 text-muted"><LocalizedText id="about.disclaimer" /></p>
        </div>
        <div className="mt-10 text-center">
          <Link href="/submit" className="button-primary"><LocalizedText id="about.submit" /> <span className="ml-2" aria-hidden="true">→</span></Link>
        </div>
      </div>
    </div>
  );
}
