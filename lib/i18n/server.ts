import "server-only";

import { cookies } from "next/headers";
import { isLocale, type Locale } from "./messages";

export async function getRequestLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get("deal-finder-locale")?.value;
  return isLocale(value) ? value : "en";
}
