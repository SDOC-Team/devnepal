"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  FONT_SCALES,
  STORAGE_KEYS,
} from "@/components/modules/common/official-website-bar/constants";
import type {
  AccessibilityActions,
  AccessibilityState,
  ColorFilterOption,
  FontSizeOption,
  LineHeightOption,
  TextSpacingOption,
} from "@/components/modules/common/official-website-bar/types";
import type { Locale } from "@/lib/i18n";

export interface UseAccessibilityResult extends AccessibilityState, AccessibilityActions {
  resolvedTheme: string | undefined;
  setTheme: (theme: string) => void;
}

export function useAccessibility(locale: Locale): UseAccessibilityResult {
  const [fontSize, setFontSize] = useState<FontSizeOption>("normal");
  const [highContrast, setHighContrast] = useState(false);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [textSpacing, setTextSpacing] = useState<TextSpacingOption>("normal");
  const [lineHeight, setLineHeight] = useState<LineHeightOption>("normal");
  const [biggerCursor, setBiggerCursor] = useState(false);
  const [pauseAnimations, setPauseAnimations] = useState(false);
  const [hideImages, setHideImages] = useState(false);
  const [colorFilter, setColorFilter] = useState<ColorFilterOption>("none");
  const [screenReader, setScreenReader] = useState(false);

  const { resolvedTheme, setTheme } = useTheme();

  // Load and apply saved settings on mount
  useEffect(() => {
    const savedScale = localStorage.getItem(STORAGE_KEYS.fontSize) as FontSizeOption | null;
    if (savedScale && FONT_SCALES[savedScale]) {
      setFontSize(savedScale);
      document.documentElement.style.fontSize = FONT_SCALES[savedScale];
    }

    const savedHighContrast = localStorage.getItem(STORAGE_KEYS.highContrast) === "true";
    if (savedHighContrast) {
      setHighContrast(true);
      document.documentElement.classList.add("high-contrast");
    }

    const savedDyslexia = localStorage.getItem(STORAGE_KEYS.dyslexia) === "true";
    if (savedDyslexia) {
      setDyslexiaFont(true);
      document.documentElement.classList.add("a11y-dyslexia");
    }

    const savedSpacing = localStorage.getItem(STORAGE_KEYS.spacing) as TextSpacingOption | null;
    if (savedSpacing && savedSpacing !== "normal") {
      setTextSpacing(savedSpacing);
      document.documentElement.classList.add(`a11y-spacing-${savedSpacing}`);
    }

    const savedLineHeight = localStorage.getItem(
      STORAGE_KEYS.lineHeight,
    ) as LineHeightOption | null;
    if (savedLineHeight && savedLineHeight !== "normal") {
      setLineHeight(savedLineHeight);
      document.documentElement.classList.add(`a11y-line-height-${savedLineHeight}`);
    }

    const savedCursor = localStorage.getItem(STORAGE_KEYS.cursor) === "true";
    if (savedCursor) {
      setBiggerCursor(true);
      document.documentElement.classList.add("a11y-bigger-cursor");
    }

    const savedAnimations = localStorage.getItem(STORAGE_KEYS.animations) === "true";
    if (savedAnimations) {
      setPauseAnimations(true);
      document.documentElement.classList.add("a11y-pause-animations");
    }

    const savedHideImages = localStorage.getItem(STORAGE_KEYS.hideImages) === "true";
    if (savedHideImages) {
      setHideImages(true);
      document.documentElement.classList.add("a11y-hide-images");
    }

    const savedColorFilter = localStorage.getItem(
      STORAGE_KEYS.colorFilter,
    ) as ColorFilterOption | null;
    if (savedColorFilter && savedColorFilter !== "none") {
      setColorFilter(savedColorFilter);
      document.documentElement.classList.add(`a11y-filter-${savedColorFilter}`);
    }
  }, []);

  // Screen reader speech listener
  useEffect(() => {
    if (!screenReader) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const speak = (text: string) => {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = locale === "ne" ? "ne-NP" : "en-US";
      window.speechSynthesis.speak(utterance);
    };

    speak(locale === "ne" ? "स्क्रिन रिडर सक्रिय भयो" : "Screen reader activated");

    const onFocusIn = (e: FocusEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el) return;
      const text =
        el.getAttribute("aria-label") ||
        el.innerText ||
        el.getAttribute("title") ||
        el.getAttribute("alt") ||
        "";
      if (text.trim()) {
        speak(text.trim().slice(0, 150));
      }
    };

    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      window.speechSynthesis.cancel();
    };
  }, [screenReader, locale]);

  const handleFontSizeChange = (size: FontSizeOption) => {
    setFontSize(size);
    localStorage.setItem(STORAGE_KEYS.fontSize, size);
    document.documentElement.style.fontSize = FONT_SCALES[size];
  };

  const handleHighContrastChange = (enabled: boolean) => {
    setHighContrast(enabled);
    localStorage.setItem(STORAGE_KEYS.highContrast, String(enabled));
    document.documentElement.classList.toggle("high-contrast", enabled);
  };

  const handleDyslexiaChange = (enabled: boolean) => {
    setDyslexiaFont(enabled);
    localStorage.setItem(STORAGE_KEYS.dyslexia, String(enabled));
    document.documentElement.classList.toggle("a11y-dyslexia", enabled);
  };

  const handleTextSpacingChange = (spacing: TextSpacingOption) => {
    document.documentElement.classList.remove("a11y-spacing-medium", "a11y-spacing-heavy");
    setTextSpacing(spacing);
    localStorage.setItem(STORAGE_KEYS.spacing, spacing);
    if (spacing !== "normal") {
      document.documentElement.classList.add(`a11y-spacing-${spacing}`);
    }
  };

  const handleLineHeightChange = (height: LineHeightOption) => {
    document.documentElement.classList.remove("a11y-line-height-relaxed", "a11y-line-height-loose");
    setLineHeight(height);
    localStorage.setItem(STORAGE_KEYS.lineHeight, height);
    if (height !== "normal") {
      document.documentElement.classList.add(`a11y-line-height-${height}`);
    }
  };

  const handleBiggerCursorChange = (enabled: boolean) => {
    setBiggerCursor(enabled);
    localStorage.setItem(STORAGE_KEYS.cursor, String(enabled));
    document.documentElement.classList.toggle("a11y-bigger-cursor", enabled);
  };

  const handlePauseAnimationsChange = (enabled: boolean) => {
    setPauseAnimations(enabled);
    localStorage.setItem(STORAGE_KEYS.animations, String(enabled));
    document.documentElement.classList.toggle("a11y-pause-animations", enabled);
  };

  const handleHideImagesChange = (enabled: boolean) => {
    setHideImages(enabled);
    localStorage.setItem(STORAGE_KEYS.hideImages, String(enabled));
    document.documentElement.classList.toggle("a11y-hide-images", enabled);
  };

  const handleColorFilterChange = (filter: ColorFilterOption) => {
    document.documentElement.classList.remove(
      "a11y-filter-protanopia",
      "a11y-filter-deuteranopia",
      "a11y-filter-tritanopia",
      "a11y-filter-grayscale",
    );
    setColorFilter(filter);
    localStorage.setItem(STORAGE_KEYS.colorFilter, filter);
    if (filter !== "none") {
      document.documentElement.classList.add(`a11y-filter-${filter}`);
    }
  };

  const handleResetAccessibility = () => {
    handleFontSizeChange("normal");
    setTheme("light");
    handleHighContrastChange(false);
    handleDyslexiaChange(false);
    handleTextSpacingChange("normal");
    handleLineHeightChange("normal");
    handleBiggerCursorChange(false);
    handlePauseAnimationsChange(false);
    handleHideImagesChange(false);
    handleColorFilterChange("none");
    setScreenReader(false);
  };

  return {
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
  };
}
