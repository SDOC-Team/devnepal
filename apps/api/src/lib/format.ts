import type { Locale } from "./i18n";

/**
 * The portal is a Nepal government service: every timestamp renders in Nepal
 * time regardless of where the server or the reader is.
 */
export const DISPLAY_TIME_ZONE = "Asia/Kathmandu";

function intlLocale(locale: Locale): string {
  return locale === "ne" ? "ne-NP" : "en-GB";
}

export function formatDate(iso: string, locale: Locale): string {
  return new Date(iso).toLocaleDateString(intlLocale(locale), {
    timeZone: DISPLAY_TIME_ZONE,
  });
}

export function formatDateTime(iso: string, locale: Locale): string {
  return new Date(iso).toLocaleString(intlLocale(locale), {
    timeZone: DISPLAY_TIME_ZONE,
  });
}
