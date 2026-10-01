import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LocaleProvider } from "@/components/LocaleProvider";
import { getRequestLocale } from "@/lib/i18n/server";
import { translate } from "@/lib/i18n/messages";
import "./globals.css";

function getMetadataBase(): URL | undefined {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configuredUrl) return undefined;
  try {
    const url = new URL(configuredUrl);
    if (url.protocol !== "https:" && url.hostname !== "localhost") return undefined;
    return url;
  } catch {
    return undefined;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const description = translate(locale, "home.heroDescription");
  const title = locale === "tr"
    ? "DealFinder — Bağımsız satıcılardan daha iyi fırsatlar"
    : "DealFinder — Find better deals from independent sellers";

  return {
    metadataBase: getMetadataBase(),
    title: { default: title, template: "%s | DealFinder" },
    description,
    openGraph: { title, description, type: "website" },
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getRequestLocale();

  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <body>
        <LocaleProvider initialLocale={locale}>
          <Header />
          <main>{children}</main>
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}
