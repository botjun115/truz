"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

/**
 * 将来の実動画と同じレイアウトを先取りする動画プレースホルダー。
 * 親要素が aspect / rounded / overflow-hidden / 背景色を持つ前提で全面に敷く。
 */
export function VideoPlaceholder() {
  return (
    <div className="relative h-full w-full">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(130% 100% at 50% 18%, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.35) 100%)",
        }}
      />
      <motion.span
        animate={{ opacity: [0.3, 0.65, 0.3] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 flex items-center justify-center text-faint"
        aria-hidden
      >
        <Play size={22} fill="currentColor" strokeWidth={0} />
      </motion.span>
      <span className="pointer-events-none absolute inset-0 rounded-media ring-1 ring-inset ring-white/[0.06]" />
    </div>
  );
}