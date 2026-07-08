export const RADIUS = {
  control: 16,
  media: 18,
  card: 28,
  pill: 999,
} as const;

export type RadiusToken = keyof typeof RADIUS;
