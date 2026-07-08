"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export interface PostButtonProps {
  onPost: () => void;
  isPosting: boolean;
}

/** 投稿ボタン(擬似アップロード中はスピナー表示) */
export function PostButton({ onPost, isPosting }: PostButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onPost}
      disabled={isPosting}
      whileTap={isPosting ? undefined : { scale: 0.97 }}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-control bg-ink text-sm font-semibold text-bg disabled:opacity-70"
    >
      {isPosting ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          Posting…
        </>
      ) : (
        "Post"
      )}
    </motion.button>
  );
}