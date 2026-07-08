import { CURRENT_USER } from "@/lib/currentUser";
import type { FeedItem } from "@/types/feed";
import type { Quest } from "@/types/quest";
import type { SupportReaction } from "@/types/reaction";

const EMPTY_REACTIONS: SupportReaction[] = [
  { type: "support", count: 0 },
  { type: "keepGoing", count: 0 },
  { type: "greatConsistency", count: 0 },
  { type: "doItTogether", count: 0 },
];

/** 自分が公開したQuestをフィード表示用のFeedItemへ変換する */
export function questToFeedItem(quest: Quest): FeedItem {
  return {
    id: `feed_${quest.id}`,
    author: CURRENT_USER,
    quest,
    reactions: EMPTY_REACTIONS,
    createdAt: quest.startTimestamp,
  };
}