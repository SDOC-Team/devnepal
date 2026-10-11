"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LOCALES, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { AccessibilityMenu } from "./accessibility-menu";
import { ASSETS, chromeControlClassName, LANGUAGES } from "./official-website-bar/constants";

export function OfficialWebsiteBar({ locale }: { locale: Locale }) {
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
      <div className="bg-primary px-4 py-0.5 text-primary-foreground sm:px-8 lg:px-16">
        <div className="flex min-h-7 w-full flex-wrap items-center justify-between gap-3 text-xs sm:min-h-8">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            {/* biome-ignore lint/performance/noImgElement: national emblem */}
            <img
              src={ASSETS.emblem}
              alt=""
              width={16}
              height={14}
              className="shrink-0"
              data-a11y-preserve="true"
            />
            <p className="text-[11px] font-medium sm:text-xs">
              {locale === "ne"
                ? "नेपाल सरकारको आधिकारिक वेबसाइट"
                : "A Nepal Government Official Website"}
            </p>
          </div>

          <div className="flex items-center justify-end gap-3">
            <AccessibilityMenu locale={locale} />

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
                {/* biome-ignore lint/performance/noImgElement: static vector icon */}
                <img src={ASSETS.language} alt="" width={16} height={16} className="shrink-0" />
                <span>{languageLabel}</span>
                {/* biome-ignore lint/performance/noImgElement: static vector icon */}
                <img src={ASSETS.caretDown} alt="" width={16} height={16} className="shrink-0" />
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
    </div>
  );
}
