"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LOCALES, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const ASSETS = {
  emblem: "/official-website-bar/emblem-of-nepal.png",
  caret: "/official-website-bar/caret.svg",
  accessibility: "/official-website-bar/accessibility.svg",
  divider: "/official-website-bar/divider.svg",
  language: "/official-website-bar/language.svg",
  caretDown: "/official-website-bar/caret-down.svg",
  bank: "/official-website-bar/bank-fill.svg",
  lock: "/official-website-bar/lock-fill.svg",
  external: "/official-website-bar/external-link.svg",
} as const;

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "ne", label: "नेपाली" },
] as const;

const chromeControlClassName =
  "inline-flex items-center gap-1 rounded-md border border-transparent text-xs font-medium text-primary-foreground outline-none transition-all hover:bg-primary-foreground/10 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

function MastheadIcon({
  src,
  alt = "",
  className,
}: {
  src: string;
  alt?: string;
  className?: string;
}) {
  return (
    // biome-ignore lint/performance/noImgElement: official bar static vector icon
    <img src={src} alt={alt} width={20} height={20} className={cn("shrink-0", className)} />
  );
}

function OfficialWebsiteBar({ locale }: { locale: Locale }) {
  const [identified, setIdentified] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const rest = pathname.split("/").filter(Boolean).slice(1).join("/");

  const handleLanguageChange = (nextLocale: string) => {
    if (LOCALES.includes(nextLocale as Locale)) {
      router.push(`/${nextLocale}${rest.length > 0 ? `/${rest}` : ""}`);
    }
  };

  const languageLabel = LANGUAGES.find((item) => item.value === locale)?.label ?? "English";

  return (
    <div data-slot="official-website-bar" className="w-full">
      <div className="flex min-h-12 items-center justify-between gap-4 bg-primary px-4 py-1 text-primary-foreground sm:px-8 lg:px-16">
        <div className="flex min-w-0 flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            {/* biome-ignore lint/performance/noImgElement: national emblem */}
            <img src={ASSETS.emblem} alt="" width={20} height={17} className="shrink-0" />
            <p className="text-xs font-medium">
              {locale === "ne"
                ? "नेपाल सरकारको आधिकारिक वेबसाइट"
                : "A Nepal Government Official Website"}
            </p>
          </div>
          <button
            type="button"
            className={cn(chromeControlClassName, "cursor-pointer gap-1 px-1 py-1")}
            aria-expanded={identified}
            aria-controls="official-website-identify-panel"
            onClick={() => setIdentified((open) => !open)}
          >
            {locale === "ne" ? "कसरी पहिचान गर्ने" : "How to identify"}
            <span
              className={cn(
                "inline-flex transition-transform motion-reduce:transition-none",
                identified && "rotate-180",
              )}
            >
              <MastheadIcon src={ASSETS.caret} />
            </span>
          </button>
        </div>

        <div className="flex items-center justify-end gap-4">
          <div className="flex items-center gap-4">
            <MastheadIcon src={ASSETS.accessibility} />
            {/* biome-ignore lint/performance/noImgElement: divider */}
            <img src={ASSETS.divider} alt="" width={1} height={20} className="shrink-0" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(chromeControlClassName, "cursor-pointer gap-2 px-1 py-1")}
              aria-label="Language"
            >
              <MastheadIcon src={ASSETS.language} />
              <span>{languageLabel}</span>
              <MastheadIcon src={ASSETS.caretDown} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup value={locale} onValueChange={handleLanguageChange}>
                {LANGUAGES.map((item) => (
                  <DropdownMenuRadioItem key={item.value} value={item.value}>
                    {item.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {identified ? (
        <div
          id="official-website-identify-panel"
          className="flex flex-col gap-8 bg-muted px-4 py-4 transition-opacity duration-200 ease-out starting:opacity-0 motion-reduce:transition-none sm:flex-row sm:px-8 lg:px-16"
        >
          <div className="flex min-w-0 flex-1 items-start gap-2">
            <MastheadIcon src={ASSETS.bank} className="dark:brightness-0 dark:invert" />
            <div className="flex min-w-0 flex-col gap-1">
              <p className="text-sm font-semibold">Official website links end with .gov.np</p>
              <p className="text-sm text-muted-foreground">
                Government agencies communicate via .gov.np websites (e.g. nepal.gov.np).
              </p>
              <a
                href="https://nepal.gov.np"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 dark:text-foreground"
              >
                Trusted websites
                <MastheadIcon src={ASSETS.external} />
              </a>
            </div>
          </div>
          <div className="flex min-w-0 flex-1 items-start gap-2">
            <MastheadIcon src={ASSETS.lock} className="dark:brightness-0 dark:invert" />
            <div className="flex min-w-0 flex-col gap-1">
              <p className="text-sm font-semibold">Secure websites use HTTPS</p>
              <p className="text-sm text-muted-foreground">
                {"Look for a lock ("}
                <MastheadIcon
                  src={ASSETS.lock}
                  className="inline-block align-text-bottom dark:brightness-0 dark:invert"
                />
                {
                  ") or https:// as an added precaution. Share sensitive information only on official, secure websites."
                }
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export { OfficialWebsiteBar };
