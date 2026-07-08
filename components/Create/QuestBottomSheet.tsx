"use client";

import { AnimatePresence, motion } from "framer-motion";
import { QuestInput } from "@/components/Create/QuestInput";

export interface QuestBottomSheetProps {
  open: boolean;
  questName: string;
  onQuestNameChange: (value: string) => void;
  onNext: () => void;
  onClose: () => void;
}

/** 下からスライドインするBottom Sheet。背後のHomeはブラー付き暗幕で見える */
export function QuestBottomSheet({
  open,
  questName,
  onQuestNameChange,
  onNext,
  onClose,
}: QuestBottomSheetProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
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
            className="relative w-full max-w-md rounded-t-card border-t border-line bg-surface px-5 pb-10 pt-4"
          >
            <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-line" />
            <h2 className="mb-6 font-display text-xl font-semibold text-ink">
              What is today&apos;s quest?
            </h2>
            <QuestInput value={questName} onChange={onQuestNameChange} onNext={onNext} />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}