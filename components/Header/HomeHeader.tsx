"use client";

import { FeedTabs } from "@/components/Feed/FeedTabs";
import { APP_NAME } from "@/constants/config";
import type { FeedTab } from "@/types/feed";

export interface HomeHeaderProps {
  tab: FeedTab;
  onTabChange: (tab: FeedTab) => void;
}

/** Home専用ヘッダー: ロゴ + タブ(スクロール時は背景をブラー) */
export function HomeHeader({ tab, onTabChange }: HomeHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="px-5 pt-4">
        <p className="font-sans text-[28px] font-bold leading-none tracking-[2px] text-ink">
          {APP_NAME} <span className="text-accent">•</span>
        </p>
        <div className="mt-4">
          <FeedTabs tab={tab} onChange={onTabChange} />
        </div>
      </div>
    </header>
  );
}