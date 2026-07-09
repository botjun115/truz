"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SupportButtons } from "@/components/Buttons/SupportButtons";
import { QuestDuration } from "@/components/Quest/QuestDuration";
import { QuestTitle } from "@/components/Quest/QuestTitle";
import { VerifiedBadge } from "@/components/Verified/VerifiedBadge";
import { VideoPlaceholder } from "@/components/Video/VideoPlaceholder";
import { VideoPlayer } from "@/components/Video/VideoPlayer";
import { EASE } from "@/constants/animation";
import type { FeedItem } from "@/types/feed";
import type { SupportReactionType } from "@/types/reaction";
import { formatDuration, formatTimeAgo } from "@/utils/time";

export interface FeedCardProps {
  item: FeedItem;
  index?: number;
  footer?: React.ReactNode;
}

/** 完了済みクエスト1件分の2カラムカード(START左・END右) */
export function FeedCard({ item, index = 0, footer }: FeedCardProps) {
  const { quest, author } = item;
  const [reacted, setReacted] = useState<ReadonlySet<SupportReactionType>>(new Set());

  const toggleReaction = (type: SupportReactionType) => {
    setReacted((current) => {
      const next = new Set(current);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE.out, delay: Math.min(index * 0.06, 0.3) }}
      whileHover={{ y: -3 }}
      className="my-4 will-change-transform rounded-card border border-line bg-surface p-5 shadow-card"
    >
      <header className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 font-display text-lg font-bold text-ink ring-1 ring-white/[0.06]">
          {author.displayName.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold text-ink">{author.displayName}</p>
          <p className="text-[13px] text-soft">{formatTimeAgo(item.createdAt)}</p>
        </div>
        <VerifiedBadge />
      </header>

      <div className="mt-3.5">
        <QuestTitle title={quest.questName} />
      </div>
      <div className="mt-1.5">
        <QuestDuration label={formatDuration(quest.durationMs ?? 0)} />
      </div>

      <div className="mt-3.5 flex gap-3">
        <div className="relative aspect-[9/16] flex-1 overflow-hidden rounded-media bg-surface-2">
          {quest.startVideo ? (
            <VideoPlayer
              src={quest.startVideo.uri}
              poster={quest.startVideo.posterUri ?? undefined}
            />
          ) : (
            <VideoPlaceholder />
          )}
          <MediaBadge label="START • 3s" />
        </div>
        <div className="relative aspect-[9/16] flex-1 overflow-hidden rounded-media bg-surface-2">
          {quest.endVideo ? (
            <VideoPlayer
              src={quest.endVideo.uri}
              poster={quest.endVideo.posterUri ?? undefined}
            />
          ) : (
            <VideoPlaceholder />
          )}
          <MediaBadge label="END • 3s" />
        </div>
      </div>

      <div className="mt-4">
        <SupportButtons activeTypes={[...reacted]} onReact={toggleReaction} />
      </div>

      {footer ? <div className="mt-3.5">{footer}</div> : null}
    </motion.article>
  );
}

function MediaBadge({ label }: { label: string }) {
  return (
    <span className="absolute bottom-2.5 left-2.5 rounded-full bg-black/40 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-white backdrop-blur-sm">
      {label}
    </span>
  );
}