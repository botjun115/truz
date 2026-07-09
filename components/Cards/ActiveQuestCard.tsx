"use client";

import { motion } from "framer-motion";
import { Square } from "lucide-react";
import { Timer } from "@/components/Timer/Timer";
import { VideoPlaceholder } from "@/components/Video/VideoPlaceholder";
import { VideoPlayer } from "@/components/Video/VideoPlayer";
import { EASE } from "@/constants/animation";
import type { Quest } from "@/types/quest";

export interface ActiveQuestCardProps {
  quest: Quest;
  onEnd: () => void;
}

/**
 * 進行中クエストのコンパクトなバナーカード。
 * 小さなSTART動画プレビュー + タイトル + 経過タイマー + 右端に終了ボタン。
 * 大きな2カラムやTAP TO ENDの大枠は出さない。
 */
export function ActiveQuestCard({ quest, onEnd }: ActiveQuestCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE.out }}
      className="my-4 flex items-center gap-3 rounded-card border border-line bg-surface p-3 shadow-card"
    >
      <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-media bg-surface-2">
        {quest.startVideo ? (
          <VideoPlayer src={quest.startVideo.uri} poster={quest.startVideo.posterUri ?? undefined} />
        ) : (
          <VideoPlaceholder />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent">
            Active
          </span>
        </div>
        <p className="truncate text-sm font-bold text-ink">{quest.questName}</p>
        <div className="mt-0.5">
          <Timer startTimestamp={quest.startTimestamp} />
        </div>
      </div>

      <motion.button
        type="button"
        onClick={onEnd}
        whileTap={{ scale: 0.9 }}
        aria-label="End quest"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-bg"
      >
        <Square size={16} fill="currentColor" strokeWidth={0} />
      </motion.button>
    </motion.article>
  );
}