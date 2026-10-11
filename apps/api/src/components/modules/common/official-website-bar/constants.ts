import type { FontSizeOption } from "./types";

export const ASSETS = {
  emblem: "/official-website-bar/emblem-of-nepal.png",
  accessibility: "/official-website-bar/accessibility.svg",
  divider: "/official-website-bar/divider.svg",
  language: "/official-website-bar/language.svg",
  caretDown: "/official-website-bar/caret-down.svg",
} as const;

export const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "ne", label: "नेपाली" },
] as const;

export const FONT_SCALES: Record<FontSizeOption, string> = {
  small: "90%",
  normal: "100%",
  large: "115%",
  xlarge: "130%",
};

export const STORAGE_KEYS = {
  fontSize: "nepal-gov-font-size",
  highContrast: "nepal-gov-high-contrast",
  dyslexia: "nepal-gov-dyslexia",
  spacing: "nepal-gov-spacing",
  lineHeight: "nepal-gov-line-height",
  cursor: "nepal-gov-bigger-cursor",
  animations: "nepal-gov-pause-animations",
  hideImages: "nepal-gov-hide-images",
  colorFilter: "nepal-gov-color-filter",
} as const;

export const chromeControlClassName =
  "inline-flex items-center gap-1 rounded-md border border-transparent text-xs font-medium text-primary-foreground outline-none transition-all hover:bg-primary-foreground/10 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";
