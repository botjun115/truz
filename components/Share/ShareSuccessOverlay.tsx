"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Instagram, Link2, MessageCircle, Share2 } from "lucide-react";

/**
 * 投稿成功直後だけ表示されるモーダルオーバーレイ。
 * ✅ Posted Successfully のアニメ後、Share先(Instagram / X / LINE / その他 / Copy)を表示。
 * 自己完結: 既存の型・サービス・Contextに一切依存しない。
 */

export interface ShareSuccessOverlayProps {
  open: boolean;
  onDone: () => void;
  questName?: string;
  shareUrl?: string;
}

function buildShareData(questName?: string, shareUrl?: string) {
  const name = questName?.trim();
  const text = name
    ? `I just completed "${name}" on TRUZ! 🔥`
    : "I just completed my challenge on TRUZ! 🔥";
  const url =
    shareUrl ?? (typeof window !== "undefined" ? window.location.origin : "https://truz.app");
  return { title: "TRUZ", text, url };
}

export function ShareSuccessOverlay({ open, onDone, questName, shareUrl }: ShareSuccessOverlayProps) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  useEffect(() => {
    if (!open) setCopied(false);
  }, [open]);

  const data = buildShareData(questName, shareUrl);
  const encodedText = encodeURIComponent(data.text);
  const encodedUrl = encodeURIComponent(data.url);

  const openIntent = useCallback((url: string) => {
    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }, []);

  const handleNativeShare = useCallback(async () => {
    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share({ title: data.title, text: data.text, url: data.url });
      }
    } catch {
      // キャンセル/失敗は無視(投稿機能に影響を与えない)
    }
  }, [data.title, data.text, data.url]);

  const handleCopy = useCallback(async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(`${data.text} ${data.url}`);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      // コピー失敗も無視
    }
  }, [data.text, data.url]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            type="button"
            aria-label="Close"
            onClick={onDone}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
            className="relative w-full max-w-md rounded-t-[28px] border-t border-line bg-surface px-5 pb-10 pt-6"
          >
            <div className="mx-auto mb-6 flex flex-col items-center gap-3">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 16 }}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-bg"
              >
                <Check size={34} strokeWidth={3} />
              </motion.span>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-display text-xl font-bold text-ink"
              >
                Posted Successfully
              </motion.p>
            </div>

            {canNativeShare ? (
              <button
                type="button"
                onClick={handleNativeShare}
                className="mb-3 flex h-12 w-full items-center justify-center gap-2 rounded-[16px] bg-ink text-sm font-semibold text-bg"
              >
                <Share2 size={18} />
                Share…
              </button>
            ) : null}

            <div className="flex flex-col gap-2.5">
              <ShareRow icon={<Instagram size={18} />} label="Instagram" onClick={handleNativeShare} />
              <ShareRow
                icon={<XLogo />}
                label="X"
                onClick={() =>
                  openIntent(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`)
                }
              />
              <ShareRow
                icon={<MessageCircle size={18} />}
                label="LINE"
                onClick={() =>
                  openIntent(`https://social-plugins.line.me/lineit/share?url=${encodedUrl}`)
                }
              />
              <ShareRow
                icon={copied ? <Check size={18} /> : <Link2 size={18} />}
                label={copied ? "Copied!" : "Copy Link"}
                onClick={handleCopy}
              />
            </div>

            <button
              type="button"
              onClick={onDone}
              className="mt-4 flex h-12 w-full items-center justify-center rounded-[16px] border border-line bg-surface text-sm font-semibold text-ink"
            >
              Done
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function ShareRow({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="flex h-[54px] items-center gap-3 rounded-[16px] border border-line bg-surface px-4 text-left text-sm font-semibold text-ink"
    >
      {icon}
      <span className="flex-1">{label}</span>
    </motion.button>
  );
}

/** lucideにXの新ロゴが無いため簡易SVG */
function XLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}