import type { FeedItem } from "@/types/feed";

/**
 * Home Feed用の一時的なモックデータ。
 * バックエンド接続時にこのファイルを削除する。
 *
 * すべて @/types/feed の FeedItem 構造に厳密準拠:
 *   FeedItem { id, author: User, quest: Quest, reactions: SupportReaction[], createdAt }
 *   - author: { id, displayName, avatarUrl, createdAt }
 *   - quest:  { id, questName, status, startVideo, endVideo, startTimestamp, endTimestamp, durationMs }
 */

const HOUR = 60 * 60 * 1000;
const MINUTE = 60 * 1000;
const DAY = 24 * HOUR;
const NOW = Date.now();

interface MockSpec {
  id: string;
  name: string;
  questName: string;
  durationMs: number;
  hoursAgo: number;
  reactions: [number, number, number, number];
}

function buildItem(spec: MockSpec): FeedItem {
  const endTimestamp = NOW - spec.hoursAgo * HOUR;
  const startTimestamp = endTimestamp - spec.durationMs;

  return {
    id: spec.id,
    author: {
      id: `user_${spec.id}`,
      displayName: spec.name,
      avatarUrl: null,
      createdAt: NOW - 90 * DAY,
    },
    quest: {
      id: `quest_${spec.id}`,
      questName: spec.questName,
      status: "completed",
      startVideo: null,
      endVideo: null,
      startTimestamp,
      endTimestamp,
      durationMs: spec.durationMs,
    },
    reactions: [
      { type: "support", count: spec.reactions[0] },
      { type: "keepGoing", count: spec.reactions[1] },
      { type: "greatConsistency", count: spec.reactions[2] },
      { type: "doItTogether", count: spec.reactions[3] },
    ],
    createdAt: endTimestamp,
  };
}

const FOLLOWING_SPECS: MockSpec[] = [
  { id: "f1", name: "Rio Sato", questName: "Morning Run — 5km", durationMs: 31 * MINUTE, hoursAgo: 2, reactions: [12, 8, 5, 3] },
  { id: "f2", name: "Mika Endo", questName: "Piano Practice — Scales", durationMs: 40 * MINUTE, hoursAgo: 5, reactions: [24, 11, 9, 2] },
  { id: "f3", name: "Kenji Aoki", questName: "Deep Work — Thesis Draft", durationMs: 134 * MINUTE, hoursAgo: 9, reactions: [31, 19, 14, 6] },
  { id: "f4", name: "Sara Lin", questName: "Kanji Review — N2", durationMs: 25 * MINUTE, hoursAgo: 26, reactions: [9, 6, 12, 1] },
  { id: "f5", name: "Daichi Mori", questName: "Cold Shower Streak", durationMs: 58 * 1000, hoursAgo: 50, reactions: [44, 28, 7, 4] },
];

const FOR_YOU_SPECS: MockSpec[] = [
  { id: "y1", name: "Yuna Park", questName: "Oil Painting — Portrait Study", durationMs: 96 * MINUTE, hoursAgo: 1, reactions: [52, 20, 18, 9] },
  { id: "y2", name: "Leo Tanaka", questName: "LeetCode — Graph Problems", durationMs: 63 * MINUTE, hoursAgo: 4, reactions: [17, 25, 8, 5] },
  { id: "y3", name: "Emma Kato", questName: "Yoga — Morning Flow", durationMs: 28 * MINUTE, hoursAgo: 7, reactions: [38, 12, 22, 11] },
  { id: "y4", name: "Haru Ito", questName: "Guitar — Fingerstyle Étude", durationMs: 47 * MINUTE, hoursAgo: 22, reactions: [21, 9, 6, 3] },
  { id: "y5", name: "Nao Fujii", questName: "Reading — Atomic Habits", durationMs: 52 * MINUTE, hoursAgo: 45, reactions: [15, 7, 19, 2] },
];

export const MOCK_FEED_FOLLOWING: FeedItem[] = FOLLOWING_SPECS.map(buildItem);

export const MOCK_FEED_FOR_YOU: FeedItem[] = FOR_YOU_SPECS.map(buildItem);