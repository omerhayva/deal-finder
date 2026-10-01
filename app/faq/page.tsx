import type { Metadata } from "next";
import { LocalizedText } from "@/components/LocalizedText";
import { getRequestLocale } from "@/lib/i18n/server";
import { translate, type MessageKey } from "@/lib/i18n/messages";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return { title: translate(locale, "faq.title"), description: translate(locale, "faq.intro") };
}

const questions: [MessageKey, MessageKey][] = [
  ["faq.q1", "faq.a1"],
  ["faq.q2", "faq.a2"],
  ["faq.q3", "faq.a3"],
  ["faq.q4", "faq.a4"],
  ["faq.q5", "faq.a5"],
  ["faq.q6", "faq.a6"],
  ["faq.q7", "faq.a7"],
  ["faq.q8", "faq.a8"],
  ["faq.q9", "faq.a9"],
];

export default function FaqPage() {
  return (
    <div className="container-shell py-12 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow"><LocalizedText id="faq.eyebrow" /></p>
        <h1 className="mt-4 font-display text-5xl tracking-tight sm:text-6xl"><LocalizedText id="faq.title" /></h1>
        <p className="mt-6 text-lg leading-8 text-muted"><LocalizedText id="faq.intro" /></p>
        <div className="mt-10 space-y-6">
          {questions.map(([question, answer]) => (
            <section key={question} className="rounded-2xl border border-ink/10 bg-white p-6">
              <h2 className="font-semibold text-ink"><LocalizedText id={question} /></h2>
              <p className="mt-3 leading-7 text-muted"><LocalizedText id={answer} /></p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
