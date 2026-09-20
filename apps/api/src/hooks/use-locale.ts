"use client";

import { useParams } from "next/navigation";

import { type Dictionary, getDictionary, isLocale, type Locale } from "@/lib/i18n";

/**
 * The active locale + its dictionary, read from the [locale] route segment.
 * Client Component pages call this instead of awaiting `params`. Falls back
 * to "en" if the segment is somehow invalid — the (site)/[locale] layout
 * already 404s on that case server-side, so this is a defensive fallback,
 * not the primary guard.
 */
export function useLocale(): { locale: Locale; dict: Dictionary } {
  const params = useParams<{ locale: string }>();
  const locale: Locale = isLocale(params.locale) ? params.locale : "en";
  return { locale, dict: getDictionary(locale) };
}
