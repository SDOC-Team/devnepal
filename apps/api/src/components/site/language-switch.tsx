"use client";

import { usePathname, useRouter } from "next/navigation";
import { Fragment } from "react";

import { LOCALES, type Locale } from "@/lib/i18n";

export function LanguageSwitch({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const rest = pathname.split("/").filter(Boolean).slice(1).join("/");

  return (
    <span className="lang-switch" title={label}>
      {LOCALES.map((entry, index) => (
        <Fragment key={entry}>
          {index > 0 ? (
            <span className="lang-switch__divider" aria-hidden="true">
              |
            </span>
          ) : null}
          <button
            type="button"
            lang={entry}
            aria-current={entry === locale ? "true" : undefined}
            onClick={() => router.push(`/${entry}${rest.length > 0 ? `/${rest}` : ""}`)}
          >
            {entry === "en" ? "EN" : "ने"}
          </button>
        </Fragment>
      ))}
    </span>
  );
}
