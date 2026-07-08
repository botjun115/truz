"use client";

import { motion } from "framer-motion";
import { PRESS_SCALE } from "@/constants/animation";
import { SUPPORT_REACTIONS } from "@/constants/config";
import type { SupportReactionType } from "@/types/reaction";

export interface SupportButtonsProps {
  activeTypes?: readonly SupportReactionType[];
  onReact: (type: SupportReactionType) => void;
}

export function SupportButtons({ activeTypes = [], onReact }: SupportButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {SUPPORT_REACTIONS.map((reaction) => {
        const active = activeTypes.includes(reaction.type);
        return (
          <motion.button
            key={reaction.type}
            type="button"
            whileTap={{ scale: PRESS_SCALE }}
            onClick={() => onReact(reaction.type)}
            className={`flex h-11 items-center justify-center gap-1.5 rounded-control border text-xs font-medium ${
              active ? "border-ink bg-ink text-bg" : "border-line bg-surface text-ink"
            }`}
          >
            <span aria-hidden>{reaction.emoji}</span>
            {reaction.label}
          </motion.button>
        );
      })}
    </div>
  );
}
