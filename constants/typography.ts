export const FONT_FAMILY = {
  sans: "var(--font-inter), system-ui, sans-serif",
  display: "var(--font-space-grotesk), sans-serif",
  mono: "var(--font-plex-mono), monospace",
} as const;

export const FONT_SIZE = {
  xs: 11,
  sm: 13,
  base: 15,
  lg: 17,
  xl: 21,
  "2xl": 26,
  "3xl": 30,
} as const;

export type FontFamilyToken = keyof typeof FONT_FAMILY;
export type FontSizeToken = keyof typeof FONT_SIZE;
