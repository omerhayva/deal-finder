import type { Metadata } from "next";
import Link from "next/link";
import { LocalizedText } from "@/components/LocalizedText";
import { getRequestLocale } from "@/lib/i18n/server";
import { translate } from "@/lib/i18n/messages";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return { title: translate(locale, "contact.title"), description: translate(locale, "contact.intro") };
}

export default function ContactPage() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
  const validEmail = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : undefined;

  return (
    <div className="container-shell py-12 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow"><LocalizedText id="contact.eyebrow" /></p>
        <h1 className="mt-4 font-display text-5xl tracking-tight sm:text-6xl"><LocalizedText id="contact.title" /></h1>
        <p className="mt-6 text-lg leading-8 text-muted"><LocalizedText id="contact.intro" /></p>
        <div className="mt-12 space-y-8 rounded-2xl border border-ink/10 bg-white p-8">
          <section>
            <h2 className="font-display text-xl tracking-tight"><LocalizedText id="contact.submissionsTitle" /></h2>
            <p className="mt-3 leading-7 text-muted"><LocalizedText id="contact.submissions" /> <Link href="/submit" className="font-semibold text-coral underline"><LocalizedText id="footer.submit" /></Link>.</p>
          </section>
          <section>
            <h2 className="font-display text-xl tracking-tight"><LocalizedText id="contact.faqTitle" /></h2>
            <p className="mt-3 leading-7 text-muted"><LocalizedText id="contact.faq" /> <Link href="/faq" className="font-semibold text-coral underline"><LocalizedText id="footer.faq" /></Link>.</p>
          </section>
          <section>
            <h2 className="font-display text-xl tracking-tight"><LocalizedText id="contact.correctionsTitle" /></h2>
            <p className="mt-3 leading-7 text-muted"><LocalizedText id="contact.corrections" /></p>
          </section>
          <section>
            <h2 className="font-display text-xl tracking-tight"><LocalizedText id="contact.emailTitle" /></h2>
            {validEmail ? (
              <a href={`mailto:${validEmail}`} className="mt-3 inline-block font-semibold text-coral underline">{validEmail}</a>
            ) : (
              <p className="mt-3 leading-7 text-muted"><LocalizedText id="contact.emailUnavailable" /></p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
