"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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

type FontSizeOption = "small" | "normal" | "large" | "xlarge";

const FONT_SCALES: Record<FontSizeOption, string> = {
  small: "90%",
  normal: "100%",
  large: "115%",
  xlarge: "130%",
};

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
    <img src={src} alt={alt} width={16} height={16} className={cn("shrink-0", className)} />
  );
}

function OfficialWebsiteBar({ locale }: { locale: Locale }) {
  const [identified, setIdentified] = useState(false);
  const [fontSize, setFontSize] = useState<FontSizeOption>("normal");
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const rest = pathname.split("/").filter(Boolean).slice(1).join("/");

  useEffect(() => {
    const savedScale = localStorage.getItem("nepal-gov-font-size") as FontSizeOption | null;
    if (savedScale && FONT_SCALES[savedScale]) {
      setFontSize(savedScale);
      document.documentElement.style.fontSize = FONT_SCALES[savedScale];
    }
  }, []);

  const handleFontSizeChange = (size: FontSizeOption) => {
    setFontSize(size);
    localStorage.setItem("nepal-gov-font-size", size);
    document.documentElement.style.fontSize = FONT_SCALES[size];
  };

  const handleResetAccessibility = () => {
    handleFontSizeChange("normal");
    setTheme("light");
  };

  const handleLanguageChange = (nextLocale: string) => {
    if (LOCALES.includes(nextLocale as Locale)) {
      router.push(`/${nextLocale}${rest.length > 0 ? `/${rest}` : ""}`);
    }
  };

  const languageLabel = LANGUAGES.find((item) => item.value === locale)?.label ?? "English";

  return (
    <div data-slot="official-website-bar" className="w-full">
      <div className="bg-primary px-3 py-0.5 text-primary-foreground sm:px-6 lg:px-12">
        <div className="mx-auto flex min-h-7 sm:min-h-8 w-full max-w-[1200px] flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              {/* biome-ignore lint/performance/noImgElement: national emblem */}
              <img src={ASSETS.emblem} alt="" width={16} height={14} className="shrink-0" />
              <p className="text-[11px] font-medium sm:text-xs">
                {locale === "ne"
                  ? "नेपाल सरकारको आधिकारिक वेबसाइट"
                  : "A Nepal Government Official Website"}
              </p>
            </div>
            <button
              type="button"
              className={cn(
                chromeControlClassName,
                "cursor-pointer px-1 py-0.5 text-[11px] sm:text-xs",
              )}
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

          <div className="flex items-center justify-end gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  chromeControlClassName,
                  "cursor-pointer gap-1.5 px-1.5 py-0.5 text-[11px] sm:text-xs",
                )}
                aria-label={locale === "ne" ? "पहुँच योग्यता सुविधाहरू" : "Accessibility Options"}
              >
                <MastheadIcon src={ASSETS.accessibility} />
                <span className="hidden sm:inline">
                  {locale === "ne" ? "पहुँच योग्यता" : "Accessibility"}
                </span>
                <MastheadIcon src={ASSETS.caretDown} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-3 gap-3 flex flex-col">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="text-xs font-semibold text-foreground">
                    {locale === "ne" ? "पहुँच योग्यता सुविधाहरू" : "Accessibility (NEA)"}
                  </span>
                </div>

                {/* Text Size Control */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-muted-foreground">
                    {locale === "ne" ? "अक्षर आकार (Text Size)" : "Text Size"}
                  </span>
                  <div className="grid grid-cols-4 gap-1">
                    <Button
                      type="button"
                      variant={fontSize === "small" ? "default" : "outline"}
                      size="xs"
                      className="font-bold text-xs"
                      onClick={() => handleFontSizeChange("small")}
                    >
                      A-
                    </Button>
                    <Button
                      type="button"
                      variant={fontSize === "normal" ? "default" : "outline"}
                      size="xs"
                      className="font-bold text-xs"
                      onClick={() => handleFontSizeChange("normal")}
                    >
                      A
                    </Button>
                    <Button
                      type="button"
                      variant={fontSize === "large" ? "default" : "outline"}
                      size="xs"
                      className="font-bold text-xs"
                      onClick={() => handleFontSizeChange("large")}
                    >
                      A+
                    </Button>
                    <Button
                      type="button"
                      variant={fontSize === "xlarge" ? "default" : "outline"}
                      size="xs"
                      className="font-bold text-xs"
                      onClick={() => handleFontSizeChange("xlarge")}
                    >
                      A++
                    </Button>
                  </div>
                </div>

                {/* Contrast / Theme Control */}
                <div className="flex flex-col gap-1.5 border-t border-border pt-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    {locale === "ne" ? "कन्ट्रास्ट र रङ (Contrast & Theme)" : "Contrast & Theme"}
                  </span>
                  <div className="grid grid-cols-2 gap-1">
                    <Button
                      type="button"
                      variant={resolvedTheme === "light" ? "default" : "outline"}
                      size="xs"
                      className="text-xs"
                      onClick={() => setTheme("light")}
                    >
                      {locale === "ne" ? "साधारण" : "Light"}
                    </Button>
                    <Button
                      type="button"
                      variant={resolvedTheme === "dark" ? "default" : "outline"}
                      size="xs"
                      className="text-xs"
                      onClick={() => setTheme("dark")}
                    >
                      {locale === "ne" ? "उच्च कन्ट्रास्ट" : "High Contrast"}
                    </Button>
                  </div>
                </div>

                {/* Reset Defaults */}
                <div className="flex items-center justify-between border-t border-border pt-2">
                  <button
                    type="button"
                    className="text-xs text-muted-foreground hover:text-foreground underline cursor-pointer"
                    onClick={handleResetAccessibility}
                  >
                    {locale === "ne" ? "पुनः सेट गर्नुहोस्" : "Reset Defaults"}
                  </button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* biome-ignore lint/performance/noImgElement: divider */}
            <img src={ASSETS.divider} alt="" width={1} height={16} className="shrink-0" />

            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  chromeControlClassName,
                  "cursor-pointer gap-1.5 px-1.5 py-0.5 text-[11px] sm:text-xs",
                )}
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
      </div>

      {identified ? (
        <div
          id="official-website-identify-panel"
          className="flex flex-col gap-6 bg-muted px-4 py-3 transition-opacity duration-200 ease-out starting:opacity-0 motion-reduce:transition-none sm:flex-row sm:px-8 lg:px-16"
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
