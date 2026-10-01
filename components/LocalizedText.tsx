"use client";

import { useLanguage } from "./LocaleProvider";
import type { MessageKey, MessageValues } from "@/lib/i18n/messages";

export function LocalizedText({ id, values }: { id: MessageKey; values?: MessageValues }) {
  const { t } = useLanguage();
  return <>{t(id, values)}</>;
}
