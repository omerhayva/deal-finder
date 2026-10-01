import type { Metadata } from "next";
import { LocalizedText } from "@/components/LocalizedText";
import { getRequestLocale } from "@/lib/i18n/server";
import { translate, type MessageKey } from "@/lib/i18n/messages";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return { title: translate(locale, "terms.title"), description: translate(locale, "terms.intro") };
}

const sections: [MessageKey, MessageKey][] = [
  ["terms.useTitle", "terms.use"],
  ["terms.offersTitle", "terms.offers"],
  ["terms.submissionsTitle", "terms.submissions"],
  ["terms.thirdPartyTitle", "terms.thirdParty"],
  ["terms.liabilityTitle", "terms.liability"],
];

export default function TermsPage() {
  return (
    <div className="container-shell py-12 sm:py-20">
      <article className="mx-auto max-w-3xl">
        <p className="eyebrow"><LocalizedText id="terms.eyebrow" /></p>
        <h1 className="mt-4 font-display text-5xl tracking-tight sm:text-6xl"><LocalizedText id="terms.title" /></h1>
        <p className="mt-6 text-lg leading-8 text-muted"><LocalizedText id="terms.intro" /></p>
        <div className="mt-10 space-y-8 rounded-2xl border border-ink/10 bg-white p-8">
          {sections.map(([heading, body]) => (
            <section key={heading}>
              <h2 className="font-display text-xl tracking-tight"><LocalizedText id={heading} /></h2>
              <p className="mt-3 leading-7 text-muted"><LocalizedText id={body} /></p>
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
