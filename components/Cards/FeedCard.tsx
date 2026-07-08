"use client";

import { Clock } from "lucide-react";
import { QuestDuration } from "@/components/Quest/QuestDuration";
import { QuestStatus } from "@/components/Quest/QuestStatus";
import { QuestTitle } from "@/components/Quest/QuestTitle";
import { Timer } from "@/components/Timer/Timer";
import { VideoPlayer } from "@/components/Video/VideoPlayer";
import type { FeedItem } from "@/types/feed";
import { formatDuration, formatTimeAgo } from "@/utils/time";

export interface FeedCardProps {
  item: FeedItem;
  footer?: React.ReactNode;
  onTapEnd?: () => void;
}

/** フィード1件分のカードレイアウト */
export function FeedCard({ item, footer, onTapEnd }: FeedCardProps) {
  const { quest, author } = item;
  const isActive = quest.status === "active";

  return (
    <article className="my-4 rounded-card border border-line bg-surface p-5 shadow-card">
      <header className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 font-display text-lg font-bold text-ink">
          {author.displayName.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold text-ink">{author.displayName}</p>
          <p className="text-[13px] text-soft">{formatTimeAgo(item.createdAt)}</p>
        </div>
        <QuestStatus status={quest.status} />
      </header>

      <div className="mt-3.5">
        <QuestTitle title={quest.questName} />
      </div>
      <div className="mt-1.5">
        {isActive ? (
          <span className="inline-flex items-center gap-1.5">
            <Clock size={14} className="text-soft" />
            <Timer startTimestamp={quest.startTimestamp} />
          </span>
        ) : (
          <QuestDuration label={formatDuration(quest.durationMs ?? 0)} />
        )}
      </div>

      <div className="mt-3.5 flex gap-3">
        <div className="relative aspect-[9/16] flex-1 overflow-hidden rounded-media bg-surface-2">
          {quest.startVideo ? (
            <VideoPlayer
              src={quest.startVideo.uri}
              poster={quest.startVideo.posterUri ?? undefined}
            />
          ) : null}
          <MediaBadge label="START • 3s" />
        </div>
        <div className="relative aspect-[9/16] flex-1 overflow-hidden rounded-media bg-surface-2">
          {quest.endVideo ? (
            <>
              <VideoPlayer
                src={quest.endVideo.uri}
                poster={quest.endVideo.posterUri ?? undefined}
              />
              <MediaBadge label="END • 3s" />
            </>
          ) : isActive ? (
            <button
              type="button"
              onClick={onTapEnd}
              className="flex h-full w-full items-center justify-center rounded-media border-2 border-dashed border-faint"
            >
              <span className="font-mono text-[11px] font-bold tracking-widest text-soft">
                TAP TO END
              </span>
            </button>
          ) : null}
        </div>
      </div>

      {footer ? <div className="mt-3.5">{footer}</div> : null}
    </article>
  );
}

function MediaBadge({ label }: { label: string }) {
  return (
    <span className="absolute bottom-2.5 left-2.5 rounded-full bg-black/40 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-white backdrop-blur-sm">
      {label}
    </span>
  );
}
