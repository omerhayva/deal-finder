"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { translate, type Locale, type MessageKey, type MessageValues } from "@/lib/i18n/messages";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey, values?: MessageValues) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function safeTranslate(locale: Locale, key: MessageKey, values?: MessageValues): string {
  try {
    return translate(locale, key, values);
  } catch (error) {
    console.error("Translation lookup failed:", key, error);
    return typeof key === "string" ? key : "";
  }
}

export function LocaleProvider({ children, initialLocale }: { children: ReactNode; initialLocale: Locale }) {
  const [locale, setCurrentLocale] = useState<Locale>(initialLocale);
  const router = useRouter();

  const setLocale = useCallback((nextLocale: Locale) => {
    setCurrentLocale(nextLocale);
    document.documentElement.lang = nextLocale;
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `deal-finder-locale=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
    router.refresh();
  }, [router]);

  const value = useMemo<LocaleContextValue>(() => ({
    locale,
    setLocale,
    t: (key, values) => safeTranslate(locale, key, values),
  }), [locale, setLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLanguage(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLanguage must be used inside LocaleProvider");
  return context;
}
