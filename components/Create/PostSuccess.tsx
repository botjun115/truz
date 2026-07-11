"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Share2 } from "lucide-react";
import { ShareOverlay } from "@/components/Share/ShareOverlay";
import { useShare } from "@/hooks/useShare";
import { buildQuestSharePayload } from "@/lib/sharePayload";
import type { ShareTarget } from "@/types/share";

export interface PostSuccessProps {
  questName: string;
  /** 将来: Firebase Storageのサムネイル/動画URL。未指定ならアプリoriginを共有 */
  shareUrl?: string | null;
  onDone: () => void;
}

/**
 * 投稿成功画面。
 * ✅ Posted Successfully のアニメ後、Share / Done の2ボタンを表示。
 * Shareを押すと、Web Share API対応端末はネイティブ共有シート、
 * 非対応ならX / LINE / コピー等のフォールバック一覧を表示する。
 */
export function PostSuccess({ questName, shareUrl, onDone }: PostSuccessProps) {
  const { canUseSystemShare, share, lastResult } = useShare();
  const [showTargets, setShowTargets] = useState(false);
  const [copied, setCopied] = useState(false);

  const payload = buildQuestSharePayload(questName, shareUrl);

  const handleSharePrimary = async () => {
    if (canUseSystemShare) {
      const result = await share("system", payload);
      // 共有シートが出せない場合のみフォールバック一覧へ
      if (result.status === "unsupported") setShowTargets(true);
      return;
    }
    setShowTargets(true);
  };

  const handleSelectTarget = async (target: ShareTarget) => {
    const result = await share(target, payload);
    if (result.status === "copied") {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8 bg-bg px-6">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 20 }}
        className="flex flex-col items-center gap-4"
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 400, damping: 16 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-accent text-bg"
        >
          <Check size={40} strokeWidth={3} />
        </motion.span>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="font-display text-2xl font-bold text-ink"
        >
          Posted Successfully
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex w-full max-w-xs flex-col gap-3"
      >
        <AnimatePresence mode="wait">
          {showTargets ? (
            <motion.div
              key="targets"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <ShareOverlay onSelect={handleSelectTarget} />
            </motion.div>
          ) : (
            <motion.button
              key="share"
              type="button"
              exit={{ opacity: 0 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSharePrimary}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-control bg-ink text-sm font-semibold text-bg"
            >
              <Share2 size={18} />
              Share
            </motion.button>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={onDone}
          className="flex h-12 w-full items-center justify-center rounded-control border border-line bg-surface text-sm font-semibold text-ink"
        >
          Done
        </button>

        <AnimatePresence>
          {copied || lastResult?.status === "copied" ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center font-mono text-xs text-soft"
            >
              Copied to clipboard
            </motion.p>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}