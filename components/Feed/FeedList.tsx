"use client";

import { ActiveQuestCard } from "@/components/Cards/ActiveQuestCard";
import { FeedCard } from "@/components/Cards/FeedCard";
import type { FeedItem } from "@/types/feed";

export interface FeedListProps {
  items: FeedItem[];
  emptyState?: React.ReactNode;
  onEndQuest?: (questId: string, questName: string) => void;
}

/**
 * フィード配列を展開する。
 * ACTIVEなクエストは細いバナー(ActiveQuestCard)、それ以外は通常の2カラムカード(FeedCard)。
 */
export function FeedList({ items, emptyState, onEndQuest }: FeedListProps) {
  if (items.length === 0) {
    return <>{emptyState ?? null}</>;
  }
  return (
    <div>
      {items.map((item, index) =>
        item.quest.status === "active" ? (
          <ActiveQuestCard
            key={item.id}
            quest={item.quest}
            onEnd={() => onEndQuest?.(item.quest.id, item.quest.questName)}
          />
        ) : (
          <FeedCard key={item.id} item={item} index={index} />
        ),
      )}
    </div>
  );
}