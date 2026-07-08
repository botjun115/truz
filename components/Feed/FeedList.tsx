"use client";

import { FeedCard } from "@/components/Cards/FeedCard";
import type { FeedItem } from "@/types/feed";

export interface FeedListProps {
  items: FeedItem[];
  emptyState?: React.ReactNode;
  onTapEnd?: (questId: string) => void;
}

/** フィード配列をカードに展開するリストレンダラー */
export function FeedList({ items, emptyState, onTapEnd }: FeedListProps) {
  if (items.length === 0) {
    return <>{emptyState ?? null}</>;
  }
  return (
    <div>
      {items.map((item) => (
        <FeedCard
          key={item.id}
          item={item}
          onTapEnd={onTapEnd ? () => onTapEnd(item.quest.id) : undefined}
        />
      ))}
    </div>
  );
}
