"use client";

import { AnimatePresence, motion } from "framer-motion";

export interface CountdownProps {
  count: number;
  visible: boolean;
}

/** 録画開始前の 3・2・1 表示 */
export function Countdown({ count, visible }: CountdownProps) {
  if (!visible) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black/45">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={count}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.6, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[96px] font-bold leading-none text-white"
        >
          {count}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}