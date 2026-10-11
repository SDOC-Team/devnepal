"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAccessibility } from "@/hooks";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { ASSETS, chromeControlClassName } from "./official-website-bar/constants";

export function AccessibilityMenu({ locale }: { locale: Locale }) {
  const {
    fontSize,
    highContrast,
    dyslexiaFont,
    textSpacing,
    lineHeight,
    biggerCursor,
    pauseAnimations,
    hideImages,
    colorFilter,
    screenReader,
    resolvedTheme,
    setTheme,
    handleFontSizeChange,
    handleHighContrastChange,
    handleDyslexiaChange,
    handleTextSpacingChange,
    handleLineHeightChange,
    handleBiggerCursorChange,
    handlePauseAnimationsChange,
    handleHideImagesChange,
    handleColorFilterChange,
    setScreenReader,
    handleResetAccessibility,
  } = useAccessibility(locale);

  return (
    <>
      {/* SVG Color Blindness Filters definition */}
      <svg className="sr-only pointer-events-none absolute" aria-hidden="true" width="0" height="0">
        <defs>
          <filter id="protanopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0"
            />
          </filter>
          <filter id="deuteranopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0"
            />
          </filter>
          <filter id="tritanopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0"
            />
          </filter>
        </defs>
      </svg>

      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            chromeControlClassName,
            "cursor-pointer gap-1.5 px-1.5 py-0.5 text-[11px] sm:text-xs",
          )}
          aria-label={locale === "ne" ? "पहुँच योग्यता सुविधाहरू" : "Accessibility Options"}
        >
          {/* biome-ignore lint/performance/noImgElement: static vector icon */}
          <img src={ASSETS.accessibility} alt="" width={16} height={16} className="shrink-0" />
          <span className="hidden sm:inline">
            {locale === "ne" ? "पहुँच योग्यता" : "Accessibility"}
          </span>
          {/* biome-ignore lint/performance/noImgElement: static vector icon */}
          <img src={ASSETS.caretDown} alt="" width={16} height={16} className="shrink-0" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-80 sm:w-88 p-3.5 gap-3 flex flex-col max-h-[85vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between border-b border-border pb-2">
            <span className="text-xs font-semibold text-foreground">
              {locale === "ne" ? "पहुँच योग्यता सुविधाहरू" : "Accessibility Options"}
            </span>
            <button
              type="button"
              className="text-[11px] text-muted-foreground hover:text-foreground underline cursor-pointer"
              onClick={handleResetAccessibility}
            >
              {locale === "ne" ? "सबै रिसेट" : "Reset All"}
            </button>
          </div>

          {/* Section 1: Text & Reading */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-semibold text-muted-foreground tracking-wide uppercase">
              {locale === "ne" ? "अक्षर र पढाइ (Text & Reading)" : "Text & Reading"}
            </span>

            {/* Text Size */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-foreground">
                {locale === "ne" ? "अक्षर आकार (Text Size)" : "Text Size"}
              </span>
              <div className="grid grid-cols-4 gap-1">
                <Button
                  type="button"
                  variant={fontSize === "small" ? "default" : "outline"}
                  size="xs"
                  className="font-bold text-xs cursor-pointer"
                  onClick={() => handleFontSizeChange("small")}
                >
                  A-
                </Button>
                <Button
                  type="button"
                  variant={fontSize === "normal" ? "default" : "outline"}
                  size="xs"
                  className="font-bold text-xs cursor-pointer"
                  onClick={() => handleFontSizeChange("normal")}
                >
                  A
                </Button>
                <Button
                  type="button"
                  variant={fontSize === "large" ? "default" : "outline"}
                  size="xs"
                  className="font-bold text-xs cursor-pointer"
                  onClick={() => handleFontSizeChange("large")}
                >
                  A+
                </Button>
                <Button
                  type="button"
                  variant={fontSize === "xlarge" ? "default" : "outline"}
                  size="xs"
                  className="font-bold text-xs cursor-pointer"
                  onClick={() => handleFontSizeChange("xlarge")}
                >
                  A++
                </Button>
              </div>
            </div>

            {/* Dyslexia Font & Text Spacing */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-foreground">
                  {locale === "ne" ? "डिस्लेक्सिया फन्ट" : "Dyslexia Font"}
                </span>
                <Button
                  type="button"
                  variant={dyslexiaFont ? "default" : "outline"}
                  size="xs"
                  className="text-xs cursor-pointer w-full font-serif"
                  onClick={() => handleDyslexiaChange(!dyslexiaFont)}
                >
                  {dyslexiaFont
                    ? locale === "ne"
                      ? "सक्रिय"
                      : "Active"
                    : locale === "ne"
                      ? "साधारण"
                      : "Default"}
                </Button>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-foreground">
                  {locale === "ne" ? "अक्षर अन्तर (Spacing)" : "Text Spacing"}
                </span>
                <div className="grid grid-cols-3 gap-0.5">
                  <Button
                    type="button"
                    variant={textSpacing === "normal" ? "default" : "outline"}
                    size="xs"
                    className="text-[11px] px-1 cursor-pointer"
                    onClick={() => handleTextSpacingChange("normal")}
                  >
                    1x
                  </Button>
                  <Button
                    type="button"
                    variant={textSpacing === "medium" ? "default" : "outline"}
                    size="xs"
                    className="text-[11px] px-1 cursor-pointer"
                    onClick={() => handleTextSpacingChange("medium")}
                  >
                    1.5x
                  </Button>
                  <Button
                    type="button"
                    variant={textSpacing === "heavy" ? "default" : "outline"}
                    size="xs"
                    className="text-[11px] px-1 cursor-pointer"
                    onClick={() => handleTextSpacingChange("heavy")}
                  >
                    2x
                  </Button>
                </div>
              </div>
            </div>

            {/* Line Height */}
            <div className="flex flex-col gap-1 pt-1">
              <span className="text-xs font-medium text-foreground">
                {locale === "ne" ? "लाइनको उचाइ (Line Height)" : "Line Height"}
              </span>
              <div className="grid grid-cols-3 gap-1">
                <Button
                  type="button"
                  variant={lineHeight === "normal" ? "default" : "outline"}
                  size="xs"
                  className="text-xs cursor-pointer"
                  onClick={() => handleLineHeightChange("normal")}
                >
                  {locale === "ne" ? "साधारण" : "Normal"}
                </Button>
                <Button
                  type="button"
                  variant={lineHeight === "relaxed" ? "default" : "outline"}
                  size="xs"
                  className="text-xs cursor-pointer"
                  onClick={() => handleLineHeightChange("relaxed")}
                >
                  1.85x
                </Button>
                <Button
                  type="button"
                  variant={lineHeight === "loose" ? "default" : "outline"}
                  size="xs"
                  className="text-xs cursor-pointer"
                  onClick={() => handleLineHeightChange("loose")}
                >
                  2.2x
                </Button>
              </div>
            </div>
          </div>

          {/* Section 2: Vision & Contrast */}
          <div className="flex flex-col gap-2 border-t border-border pt-2.5">
            <span className="text-[11px] font-semibold text-muted-foreground tracking-wide uppercase">
              {locale === "ne" ? "कन्ट्रास्ट र रङ (Vision & Contrast)" : "Vision & Contrast"}
            </span>

            {/* Theme Mode */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-foreground">
                {locale === "ne" ? "उज्यालो र अँध्यारो मोड (Theme Mode)" : "Theme Mode"}
              </span>
              <div className="grid grid-cols-2 gap-1">
                <Button
                  type="button"
                  variant={resolvedTheme === "light" ? "default" : "outline"}
                  size="xs"
                  className="text-xs cursor-pointer"
                  onClick={() => setTheme("light")}
                >
                  {locale === "ne" ? "उज्यालो" : "Light"}
                </Button>
                <Button
                  type="button"
                  variant={resolvedTheme === "dark" ? "default" : "outline"}
                  size="xs"
                  className="text-xs cursor-pointer"
                  onClick={() => setTheme("dark")}
                >
                  {locale === "ne" ? "अँध्यारो" : "Dark"}
                </Button>
              </div>
            </div>

            {/* High Contrast Mode */}
            <div className="flex flex-col gap-1 pt-1">
              <span className="text-xs font-medium text-foreground">
                {locale === "ne" ? "उच्च कन्ट्रास्ट (High Contrast)" : "High Contrast"}
              </span>
              <div className="grid grid-cols-2 gap-1">
                <Button
                  type="button"
                  variant={!highContrast ? "default" : "outline"}
                  size="xs"
                  className="text-xs cursor-pointer"
                  onClick={() => handleHighContrastChange(false)}
                >
                  {locale === "ne" ? "साधारण" : "Normal"}
                </Button>
                <Button
                  type="button"
                  variant={highContrast ? "default" : "outline"}
                  size="xs"
                  className="text-xs cursor-pointer"
                  onClick={() => handleHighContrastChange(true)}
                >
                  {locale === "ne" ? "उच्च कन्ट्रास्ट" : "High Contrast"}
                </Button>
              </div>
            </div>

            {/* Color Blindness Filters */}
            <div className="flex flex-col gap-1 pt-1">
              <span className="text-xs font-medium text-foreground">
                {locale === "ne" ? "रङ फिल्टर (Color Filters)" : "Color Filters"}
              </span>
              <div className="grid grid-cols-3 gap-1">
                <Button
                  type="button"
                  variant={colorFilter === "none" ? "default" : "outline"}
                  size="xs"
                  className="text-[11px] cursor-pointer"
                  onClick={() => handleColorFilterChange("none")}
                >
                  {locale === "ne" ? "कुनै छैन" : "None"}
                </Button>
                <Button
                  type="button"
                  variant={colorFilter === "protanopia" ? "default" : "outline"}
                  size="xs"
                  className="text-[11px] cursor-pointer"
                  onClick={() => handleColorFilterChange("protanopia")}
                >
                  Protanopia
                </Button>
                <Button
                  type="button"
                  variant={colorFilter === "deuteranopia" ? "default" : "outline"}
                  size="xs"
                  className="text-[11px] cursor-pointer"
                  onClick={() => handleColorFilterChange("deuteranopia")}
                >
                  Deuteranopia
                </Button>
                <Button
                  type="button"
                  variant={colorFilter === "tritanopia" ? "default" : "outline"}
                  size="xs"
                  className="text-[11px] cursor-pointer"
                  onClick={() => handleColorFilterChange("tritanopia")}
                >
                  Tritanopia
                </Button>
                <Button
                  type="button"
                  variant={colorFilter === "grayscale" ? "default" : "outline"}
                  size="xs"
                  className="text-[11px] col-span-2 cursor-pointer"
                  onClick={() => handleColorFilterChange("grayscale")}
                >
                  {locale === "ne" ? "ग्रेस्केल (Grayscale)" : "Grayscale"}
                </Button>
              </div>
            </div>

            {/* Hide Images */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-medium text-foreground">
                {locale === "ne" ? "तस्बिरहरू लुकाउनुहोस्" : "Hide Images"}
              </span>
              <Button
                type="button"
                variant={hideImages ? "default" : "outline"}
                size="xs"
                className="text-xs cursor-pointer"
                onClick={() => handleHideImagesChange(!hideImages)}
              >
                {hideImages
                  ? locale === "ne"
                    ? "लुकाइएको"
                    : "Hidden"
                  : locale === "ne"
                    ? "देखाइएको"
                    : "Visible"}
              </Button>
            </div>
          </div>

          {/* Section 3: Assistive Technology */}
          <div className="flex flex-col gap-2 border-t border-border pt-2.5">
            <span className="text-[11px] font-semibold text-muted-foreground tracking-wide uppercase">
              {locale === "ne" ? "सहायक उपकरणहरू (Assistive Tools)" : "Assistive Tools"}
            </span>

            {/* Screen Reader */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-foreground">
                {locale === "ne" ? "स्क्रिन रिडर (Text to Speech)" : "Screen Reader"}
              </span>
              <Button
                type="button"
                variant={screenReader ? "default" : "outline"}
                size="xs"
                className="text-xs cursor-pointer"
                onClick={() => setScreenReader(!screenReader)}
              >
                {screenReader
                  ? locale === "ne"
                    ? "सक्रिय 🔊"
                    : "Active 🔊"
                  : locale === "ne"
                    ? "निष्क्रिय"
                    : "Off"}
              </Button>
            </div>

            {/* Pause Animations */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-foreground">
                {locale === "ne" ? "एनिमेसन रोक्नुहोस्" : "Pause Animations"}
              </span>
              <Button
                type="button"
                variant={pauseAnimations ? "default" : "outline"}
                size="xs"
                className="text-xs cursor-pointer"
                onClick={() => handlePauseAnimationsChange(!pauseAnimations)}
              >
                {pauseAnimations
                  ? locale === "ne"
                    ? "रोकिएको ⏸"
                    : "Paused ⏸"
                  : locale === "ne"
                    ? "सामान्य"
                    : "Normal"}
              </Button>
            </div>

            {/* Bigger Cursor */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-foreground">
                {locale === "ne" ? "ठूलो कर्सर" : "Bigger Cursor"}
              </span>
              <Button
                type="button"
                variant={biggerCursor ? "default" : "outline"}
                size="xs"
                className="text-xs cursor-pointer"
                onClick={() => handleBiggerCursorChange(!biggerCursor)}
              >
                {biggerCursor
                  ? locale === "ne"
                    ? "सक्रिय 🔍"
                    : "Active 🔍"
                  : locale === "ne"
                    ? "साधारण"
                    : "Normal"}
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
    </>
  );
}
