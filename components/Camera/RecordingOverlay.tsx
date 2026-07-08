"use client";

import { motion } from "framer-motion";
import { RECORD_DURATION_MS } from "@/constants/config";

export interface RecordingOverlayProps {
  visible: boolean;
}

/** 録画中インジケータ(赤ドット + 3秒で満ちるプログレスバー) */
export function RecordingOverlay({ visible }: RecordingOverlayProps) {
  if (!visible) return null;
  const seconds = Math.round(RECORD_DURATION_MS / 1000);
  return (
    <>
      <div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-sm">
        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 0.9, repeat: Infinity }}
          className="h-2.5 w-2.5 rounded-full bg-danger"
        />
        <span className="font-mono text-xs font-semibold text-white">REC {seconds}s</span>
      </div>
      <div className="absolute inset-x-0 bottom-0 z-20 h-1 bg-white/15">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: RECORD_DURATION_MS / 1000, ease: "linear" }}
          className="h-full bg-danger"
        />
      </div>
    </>
  );
}