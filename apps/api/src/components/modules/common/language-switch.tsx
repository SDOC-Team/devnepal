"use client";

import { usePathname, useRouter } from "next/navigation";
import { Fragment } from "react";

import { LOCALES, type Locale } from "@/lib/i18n";

export function LanguageSwitch({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const rest = pathname.split("/").filter(Boolean).slice(1).join("/");

  return (
    <span className="inline-flex items-center gap-3" title={label}>
      {LOCALES.map((entry, index) => (
        <Fragment key={entry}>
          {index > 0 ? (
            <span className="hidden" aria-hidden="true">
              |
            </span>
          ) : null}
          <button
            type="button"
            lang={entry}
            aria-current={entry === locale ? "true" : undefined}
            onClick={() => router.push(`/${entry}${rest.length > 0 ? `/${rest}` : ""}`)}
            className="min-h-0 min-w-0 border-0 bg-transparent p-0 text-xs font-semibold text-primary-foreground opacity-72 hover:underline hover:opacity-100 hover:[text-underline-offset:3px] aria-[current=true]:underline aria-[current=true]:opacity-100 aria-[current=true]:decoration-2 aria-[current=true]:[text-underline-offset:4px]"
          >
            {entry === "en" ? "EN" : "ने"}
          </button>
        </Fragment>
      ))}
    </span>
  );
}
