"use client";

import { motion } from "framer-motion";
import type { FeedTab } from "@/types/feed";

const TABS: readonly { key: FeedTab; label: string }[] = [
  { key: "following", label: "Following" },
  { key: "forYou", label: "For You" },
];

export interface FeedTabsProps {
  tab: FeedTab;
  onChange: (tab: FeedTab) => void;
}

/** Following / For You タブ(アクティブなアンダーラインがスプリングでスライド) */
export function FeedTabs({ tab, onChange }: FeedTabsProps) {
  return (
    <div className="flex gap-7">
      {TABS.map(({ key, label }) => {
        const active = tab === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            aria-pressed={active}
            className={`relative pb-3 text-[15px] font-semibold transition-colors ${
              active ? "text-ink" : "text-faint hover:text-soft"
            }`}
          >
            {label}
            {active ? (
              <motion.span
                layoutId="home-feed-tab-underline"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
                className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-ink"
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}