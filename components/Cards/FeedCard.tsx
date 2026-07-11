"use client";

import { useMemo, useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import type { FeedItem } from "@/types/feed";

export interface FeedCardProps {
  item: FeedItem;
  index?: number;
  footer?: React.ReactNode;
}

interface LocalComment {
  id: string;
  author: string;
  text: string;
}

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord {
  if (typeof value === "object" && value !== null) {
    return value as UnknownRecord;
  }

  return {};
}

function getString(
  source: UnknownRecord,
  keys: string[],
  fallback = "",
): string {
  for (const key of keys) {
    const value = source[key];

    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return fallback;
}

function getNumber(
  source: UnknownRecord,
  keys: string[],
  fallback = 0,
): number {
  for (const key of keys) {
    const value = source[key];

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }

  return fallback;
}

function getVideoUri(source: UnknownRecord, keys: string[]): string | null {
  for (const key of keys) {
    const value = source[key];

    if (typeof value === "string" && value) {
      return value;
    }

    const nested = asRecord(value);
    const nestedUri = getString(nested, [
      "uri",
      "url",
      "src",
      "videoUrl",
      "videoUri",
    ]);

    if (nestedUri) {
      return nestedUri;
    }
  }

  return null;
}

function getInitial(name: string): string {
  const trimmed = name.trim();

  if (!trimmed) {
    return "U";
  }

  return trimmed.charAt(0).toUpperCase();
}

function VideoPanel({
  uri,
  label,
}: {
  uri: string | null;
  label: "START" | "END";
}) {
  return (
    <div className="relative aspect-[9/16] min-w-0 overflow-hidden rounded-[24px] border border-white/10 bg-[#1b1b1b]">
      {uri ? (
        <video
          src={uri}
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
          onClick={(event) => {
            const video = event.currentTarget;

            if (video.paused) {
              void video.play();
            } else {
              video.pause();
            }
          }}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="text-5xl text-white/15">▶</span>
        </div>
      )}

      <div className="absolute bottom-3 left-3 rounded-full bg-black/75 px-3 py-1 font-mono text-[12px] font-bold tracking-[0.08em] text-white">
        {label} ・ 3s
      </div>
    </div>
  );
}

export function FeedCard({
  item,
  footer,
}: FeedCardProps) {
  const data = useMemo(
    () => asRecord(item),
    [item],
  );

  const user = asRecord(
    data.user ??
      data.author ??
      data.profile,
  );

  const userName =
    getString(data, [
      "userName",
      "username",
      "displayName",
      "authorName",
      "name",
    ]) ||
    getString(user, [
      "name",
      "userName",
      "username",
      "displayName",
    ]) ||
    "You";

  const avatarUri =
    getString(data, [
      "avatarUri",
      "avatarUrl",
      "profileImage",
      "profileImageUrl",
    ]) ||
    getString(user, [
      "avatarDataUrl",
      "avatarUri",
      "avatarUrl",
      "photoURL",
    ]);

  const postedAt = getString(
    data,
    [
      "timeAgo",
      "postedAtLabel",
      "createdAtLabel",
      "relativeTime",
    ],
    "now",
  );

  const durationLabel = getString(
    data,
    [
      "durationLabel",
      "elapsedLabel",
      "timeLabel",
      "questDuration",
    ],
    "0 sec",
  );

  const questName = getString(
    data,
    [
      "questName",
      "title",
      "caption",
      "text",
      "name",
    ],
    "Untitled Quest",
  );

  const startVideoUri = getVideoUri(data, [
    "startVideo",
    "startVideoAsset",
    "startVideoUri",
    "startUri",
    "beforeVideo",
    "before",
  ]);

  const endVideoUri = getVideoUri(data, [
    "endVideo",
    "endVideoAsset",
    "endVideoUri",
    "endUri",
    "afterVideo",
    "after",
  ]);

  const initialLikes = getNumber(
    data,
    [
      "likes",
      "likeCount",
      "totalLikes",
    ],
    0,
  );

  const initialCommentCount = getNumber(
    data,
    [
      "comments",
      "commentCount",
      "totalComments",
    ],
    0,
  );

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<LocalComment[]>([]);

  const displayedCommentCount =
    initialCommentCount + comments.length;

  const toggleLike = () => {
    setLiked((current) => {
      setLikes((count) =>
        current
          ? Math.max(0, count - 1)
          : count + 1,
      );

      return !current;
    });
  };

  const submitComment = () => {
    const trimmed = commentText.trim();

    if (!trimmed) {
      return;
    }

    setComments((current) => [
      ...current,
      {
        id: `${Date.now()}-${Math.random()}`,
        author: "You",
        text: trimmed,
      },
    ]);

    setCommentText("");
    setCommentsOpen(true);
  };

  return (
    <article className="border-b border-white/10 px-5 pb-7 pt-6">
      <header className="mb-5 flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#202020] text-lg font-bold text-white">
          {avatarUri ? (
            <img
              src={avatarUri}
              alt={`${userName} profile`}
              className="h-full w-full object-cover"
            />
          ) : (
            getInitial(userName)
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[17px] font-bold text-white">
            {userName}
          </p>

          <p className="text-[14px] text-white/55">
            {postedAt}
          </p>
        </div>

        <p className="shrink-0 font-mono text-[14px] font-semibold text-white/60">
          {durationLabel}
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <VideoPanel
          uri={startVideoUri}
          label="START"
        />

        <VideoPanel
          uri={endVideoUri}
          label="END"
        />
      </div>

      <div className="mt-4 flex items-center gap-6">
        <button
          type="button"
          onClick={toggleLike}
          aria-label={liked ? "Unlike post" : "Like post"}
          className="flex items-center gap-2 text-white"
        >
          <Heart
            size={31}
            strokeWidth={2}
            className={
              liked
                ? "fill-[#ff2d7a] text-[#ff2d7a]"
                : "text-white/75"
            }
          />

          <span className="text-[17px] font-semibold">
            {likes}
          </span>
        </button>

        <button
          type="button"
          onClick={() =>
            setCommentsOpen((current) => !current)
          }
          aria-label="Open comments"
          className="flex items-center gap-2 text-white"
        >
          <MessageCircle
            size={31}
            strokeWidth={2}
            className="text-white/75"
          />

          <span className="text-[17px] font-semibold">
            {displayedCommentCount}
          </span>
        </button>
      </div>

      <p className="mt-4 text-[17px] leading-6">
        <span className="mr-2 font-bold text-white">
          {userName}
        </span>

        <span className="text-white/65">
          {questName}
        </span>
      </p>

      {commentsOpen && (
        <section className="mt-5 border-t border-white/10 pt-4">
          {comments.length > 0 && (
            <div className="mb-4 space-y-3">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="text-[15px] leading-5"
                >
                  <span className="mr-2 font-bold text-white">
                    {comment.author}
                  </span>

                  <span className="text-white/70">
                    {comment.text}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3">
            <input
              type="text"
              value={commentText}
              onChange={(event) =>
                setCommentText(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  submitComment();
                }
              }}
              placeholder={`Comment as ${userName}...`}
              className="min-w-0 flex-1 rounded-full border border-white/5 bg-[#202020] px-5 py-3 text-[15px] text-white outline-none placeholder:text-white/35 focus:border-white/20"
            />

            <button
              type="button"
              disabled={!commentText.trim()}
              onClick={submitComment}
              className="rounded-full bg-white px-5 py-3 text-[15px] font-bold text-black disabled:cursor-not-allowed disabled:opacity-35"
            >
              Post
            </button>
          </div>
        </section>
      )}

      {footer ? (
        <div className="mt-4">
          {footer}
        </div>
      ) : null}
    </article>
  );
}

export default FeedCard;