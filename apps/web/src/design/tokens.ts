/**
 * Design tokens — DevNepal / UX4G
 * Extracted from Figma file UAvHPypcjCjnptJTWJRGsU, node 2-15573
 * ("Type=1, Breakpoint=Desktop, Color=Light" — footer component).
 *
 * Mirrors tokens.json / tokens.css. Prefer the CSS custom properties for
 * styling; use these when a value is needed in JS (charts, canvas, inline SVG).
 */

export const color = {
  brand: {
    primary: "#0b3b8b",
    primaryDeep: "#001b4f",
    primaryBorder: "#90b9ff",
    primarySubtle: "#cfe3fc",
    primarySurface: "#f2f7ff",
  },
  neutral: {
    0: "#ffffff",
    50: "#fafafa",
    200: "#e5e5e5",
    500: "#737373",
    700: "#404040",
    900: "#171717",
  },
  text: {
    primary: "#171717",
    secondary: "#404040",
    muted: "#737373",
    link: "#0b3b8b",
    onDark: "#ffffff",
    onDarkMuted: "rgba(255, 255, 255, 0.87)",
    onDarkSubtle: "#fafafa",
  },
  surface: {
    default: "#ffffff",
    raised: "#f2f7ff",
    inverse: "#001b4f",
  },
  border: {
    default: "#e5e5e5",
    accent: "#90b9ff",
  },
} as const;

export const font = {
  family: {
    sans: '"Noto Sans", system-ui, sans-serif',
    display: '"Raleway", "Noto Sans", sans-serif',
  },
  weight: { regular: 400, medium: 500, semibold: 600, bold: 700 },
  size: { xs: "11px", sm: "12px", md: "13px", lg: "14px", xl: "16px" },
  lineHeight: {
    tight: "14px",
    snug: "16px",
    normal: "18px",
    relaxed: "20px",
    loose: "22px",
    link: "24px",
  },
  letterSpacing: { none: "0", tight: "0.1px", wide: "0.5px" },
} as const;

export const space = {
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "24px",
  6: "32px",
  7: "40px",
  8: "64px",
  9: "80px",
} as const;

export const radius = { sm: "4px", md: "8px", full: "999px" } as const;

export const tokens = { color, font, space, radius } as const;

export type Tokens = typeof tokens;
export type ColorToken = typeof color;
