export const COLORS = {
  light: {
    bg: "#ffffff",
    surface: "#ffffff",
    surface2: "#f2f2f2",
    ink: "#111111",
    soft: "#7a7a7a",
    faint: "#a9a9a9",
    line: "#ececec",
    accent: "#00ff66",
    danger: "#ff3b30",
  },
  dark: {
    bg: "#0b0b0b",
    surface: "#151515",
    surface2: "#212121",
    ink: "#f4f4f4",
    soft: "#9c9c9c",
    faint: "#6e6e6e",
    line: "#262626",
    accent: "#00ff66",
    danger: "#ff453a",
  },
} as const;

export type ColorToken = keyof typeof COLORS.light;
