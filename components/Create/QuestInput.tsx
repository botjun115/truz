"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { MAX_QUEST_NAME_LENGTH } from "@/constants/config";

export interface QuestInputProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

/** クエスト名の自由入力 + 円形Nextボタン(1文字以上でNext有効) */
export function QuestInput({ value, onChange, onNext }: QuestInputProps) {
  const canProceed = value.trim().length > 0;

  return (
    <div className="flex flex-col gap-6">
      <input
        autoFocus
        value={value}
        onChange={(event) => onChange(event.target.value.slice(0, MAX_QUEST_NAME_LENGTH))}
        onKeyDown={(event) => {
          if (event.key === "Enter" && canProceed) onNext();
        }}
        placeholder="Run 10km, Learn React, Read 30 pages…"
        className="w-full border-b border-line bg-transparent pb-3 text-2xl font-semibold text-ink outline-none placeholder:text-faint"
      />
      <div className="flex justify-end">
        <motion.button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          whileTap={canProceed ? { scale: 0.9 } : undefined}
          className={`flex h-16 w-16 items-center justify-center rounded-full transition-colors ${
            canProceed ? "bg-ink text-bg" : "bg-surface-2 text-faint"
          }`}
          aria-label="Next"
        >
          <ArrowRight size={26} strokeWidth={2.4} />
        </motion.button>
      </div>
    </div>
  );
}