"use client";

import { motion } from "framer-motion";
import {
  Instagram,
  Link2,
  MessageCircle,
  MoreHorizontal,
  Twitter,
  type LucideIcon,
} from "lucide-react";
import { PRESS_SCALE } from "@/constants/animation";
import { SHARE_TARGETS } from "@/constants/config";
import type { ShareTarget } from "@/types/share";
import { assertNever } from "@/utils/validation";

export interface ShareOverlayProps {
  onSelect: (target: ShareTarget) => void;
}

function iconFor(target: ShareTarget): LucideIcon {
  switch (target) {
    case "instagramStories":
      return Instagram;
    case "x":
      return Twitter;
    case "line":
      return MessageCircle;
    case "copyLink":
      return Link2;
    case "system":
      return MoreHorizontal;
    default:
      return assertNever(target);
  }
}

/** 共有先の選択リスト(Quest完了画面などに埋め込む) */
export function ShareOverlay({ onSelect }: ShareOverlayProps) {
  return (
    <div className="flex flex-col gap-2.5">
      {SHARE_TARGETS.map(({ target, label }) => {
        const Icon = iconFor(target);
        return (
          <motion.button
            key={target}
            type="button"
            whileTap={{ scale: PRESS_SCALE }}
            onClick={() => onSelect(target)}
            className="flex h-[54px] items-center gap-3 rounded-control border border-line bg-surface px-4 text-left text-sm font-semibold text-ink"
          >
            <Icon size={18} />
            <span className="flex-1">{label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
