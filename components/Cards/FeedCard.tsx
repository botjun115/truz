"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Heart, MessageCircle } from "lucide-react";
import { CommentSection, type FeedComment } from "@/components/Feed/CommentSection";
import { QuestStatus } from "@/components/Quest/QuestStatus";
import { Timer } from "@/components/Timer/Timer";
import { VideoPlaceholder } from "@/components/Video/VideoPlaceholder";
import { VideoPlayer } from "@/components/Video/VideoPlayer";
import { EASE } from "@/constants/animation";
import type { FeedItem } from "@/types/feed";
import { formatDuration, formatTimeAgo } from "@/utils/time";
import { generateId } from "@/utils/id";

export interface FeedCardProps {
  item: FeedItem;
  index?: number;
  footer?: React.ReactNode;
  onTapEnd?: () => void;
}

/** フィード1件分の投稿レイアウト(Instagram風) */
export function FeedCard({ item, index = 0, footer, onTapEnd }: FeedCardProps) {
  const { quest, author } = item;
  const isActive = quest.status === "active";

  // likes/commentsはFeedItemに無いため安全な初期値をローカルstateで持つ(Firebase未接続)
  const initialLikes = useMemo(
    () => item.reactions.reduce((sum, reaction) => sum + reaction.count, 0),
    [item.reactions],
  );
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [comments, setComments] = useState<FeedComment[]>([]);
  const [showComments, setShowComments] = useState(false);

  const toggleLike = () => {
    setLiked((prev) => {
      setLikeCount((count) => Math.max(0, prev ? count - 1 : count + 1));
      return !prev;
    });
  };

  const addComment = (body: string) => {
    setComments((current) => [
      ...current,
      { id: generateId("comment"), author: author.displayName, body },
    ]);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE.out, delay: Math.min(index * 0.06, 0.3) }}
      className="border-b border-line py-4"
    >
      {/* 1. ヘッダー */}
      <header className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 font-display text-base font-bold text-ink ring-1 ring-white/[0.06]">
          {author.displayName.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-ink">{author.displayName}</p>
          <p className="text-[12px] text-soft">{formatTimeAgo(item.createdAt)}</p>
        </div>
        {isActive ? (
          <span className="inline-flex items-center gap-1.5">
            <Clock size={14} className="text-soft" />
            <Timer startTimestamp={quest.startTimestamp} />
          </span>
        ) : (
          <span className="font-mono text-xs font-semibold text-soft">
            {formatDuration(quest.durationMs ?? 0)}
          </span>
        )}
      </header>

      {/* 2. 動画(START / END 横並び・同幅同高・縦比維持) */}
      <div className="mt-3 flex gap-2">
        <div className="relative aspect-[9/16] flex-1 overflow-hidden rounded-media bg-surface-2">
          {quest.startVideo ? (
            <VideoPlayer src={quest.startVideo.uri} poster={quest.startVideo.posterUri ?? undefined} />
          ) : (
            <VideoPlaceholder />
          )}
          <MediaBadge label="START • 3s" />
        </div>
        <div className="relative aspect-[9/16] flex-1 overflow-hidden rounded-media bg-surface-2">
          {quest.endVideo ? (
            <>
              <VideoPlayer src={quest.endVideo.uri} poster={quest.endVideo.posterUri ?? undefined} />
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
          ) : (
            <>
              <VideoPlaceholder />
              <MediaBadge label="END • 3s" />
            </>
          )}
        </div>
      </div>

      {/* 4. リアクション(ハート / コメント) */}
      <div className="mt-3 flex items-center gap-5">
        <button
          type="button"
          onClick={toggleLike}
          aria-pressed={liked}
          aria-label="Like"
          className="flex items-center gap-1.5"
        >
          <motion.span whileTap={{ scale: 0.8 }} className="inline-flex">
            <Heart
              size={22}
              className={liked ? "text-[#ff2d78]" : "text-soft"}
              fill={liked ? "#ff2d78" : "none"}
            />
          </motion.span>
          <span className="text-sm font-semibold text-ink">{likeCount}</span>
        </button>
        <button
          type="button"
          onClick={() => setShowComments((prev) => !prev)}
          aria-label="Comments"
          className="flex items-center gap-1.5"
        >
          <MessageCircle size={22} className="text-soft" />
          <span className="text-sm font-semibold text-ink">{comments.length}</span>
        </button>
      </div>

      {/* 3. クエストテキスト(投稿本文として) */}
      <p className="mt-2 text-sm text-ink">
        <span className="font-semibold">{author.displayName}</span>{" "}
        <span className="text-soft">{quest.questName}</span>
      </p>

      {/* コメント展開 */}
      {showComments ? (
        <CommentSection
          comments={comments}
          onAddComment={addComment}
          currentUserName={author.displayName}
        />
      ) : null}

      {isActive ? <div className="mt-2">{<QuestStatus status="active" />}</div> : null}

      {footer ? <div className="mt-3">{footer}</div> : null}
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