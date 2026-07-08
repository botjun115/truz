import type { Variants } from "framer-motion";

export const DURATION = {
  fast: 0.15,
  base: 0.22,
  slow: 0.4,
} as const;

type Bezier = [number, number, number, number];

export const EASE: Record<"out" | "spring", Bezier> = {
  out: [0.16, 1, 0.3, 1],
  spring: [0.34, 1.56, 0.64, 1],
};

export const PRESS_SCALE = 0.95;

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASE.out } },
};

export const overlayFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.base } },
  exit: { opacity: 0, transition: { duration: DURATION.fast } },
};
