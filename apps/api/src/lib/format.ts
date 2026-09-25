import type { Locale } from "./i18n";

/**
 * Dev Nepal serves a Nepal-based community, so timestamps render in Nepal time
 * regardless of where the server or reader is located.
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
