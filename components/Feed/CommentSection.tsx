"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface FeedComment {
  id: string;
  author: string;
  body: string;
}

export interface CommentSectionProps {
  comments: FeedComment[];
  onAddComment: (body: string) => void;
  currentUserName?: string;
}

/**
 * 投稿カード下に展開されるコメントエリア(ローカルstate前提、Firebase未接続)。
 * 入力欄 + Post。空文字は投稿不可。追加すると一覧下に積まれカードが自然に伸びる。
 */
export function CommentSection({ comments, onAddComment, currentUserName }: CommentSectionProps) {
  const [draft, setDraft] = useState("");
  const canPost = draft.trim().length > 0;

  const submit = () => {
    if (!canPost) return;
    onAddComment(draft.trim());
    setDraft("");
  };

  return (
    <div className="mt-3 border-t border-line pt-3">
      <div className="flex flex-col gap-2.5">
        <AnimatePresence initial={false}>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm leading-snug"
            >
              <span className="font-semibold text-ink">{comment.author}</span>{" "}
              <span className="text-soft">{comment.body}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && canPost) submit();
          }}
          placeholder={currentUserName ? `Comment as ${currentUserName}…` : "Add a comment…"}
          className="h-10 flex-1 rounded-control border border-line bg-surface-2 px-3 text-sm text-ink outline-none placeholder:text-faint"
        />
        <button
          type="button"
          onClick={submit}
          disabled={!canPost}
          className="h-10 shrink-0 rounded-control bg-ink px-4 text-sm font-semibold text-bg disabled:opacity-40"
        >
          Post
        </button>
      </div>
    </div>
  );
}