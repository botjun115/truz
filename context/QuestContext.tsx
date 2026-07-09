"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { usePersistentActiveQuest } from "@/hooks/usePersistentActiveQuest";
import type { Quest } from "@/types/quest";
import type { VideoAsset } from "@/types/video";

interface CompleteQuestInput {
  questId: string;
  endVideo: VideoAsset;
}

interface QuestContextValue {
  quests: Quest[];
  activeQuest: Quest | null;
  hydrated: boolean;
  addQuest: (quest: Quest) => void;
  completeQuest: (input: CompleteQuestInput) => void;
}

const QuestContext = createContext<QuestContextValue | null>(null);

/**
 * Quest状態を保持する。
 * - ACTIVEクエストはlocalStorageで永続化(リロード/アプリ再開後も復元)
 * - COMPLETED化した瞬間に永続ACTIVEを破棄し、通常のquests配列へ移す
 * - Firebase未接続(Phase 2)
 */
export function QuestProvider({ children }: { children: React.ReactNode }) {
  const { activeQuest, hydrated, persistActiveQuest, clearPersistedActiveQuest } =
    usePersistentActiveQuest();

  // COMPLETED含む一覧(このセッションで完了したもの)
  const [completedQuests, setCompletedQuests] = useState<Quest[]>([]);

  const addQuest = useCallback(
    (quest: Quest) => {
      // 新規は必ずactive。永続化して復元対象にする
      persistActiveQuest(quest);
    },
    [persistActiveQuest],
  );

  const completeQuest = useCallback(
    ({ questId, endVideo }: CompleteQuestInput) => {
      if (!activeQuest || activeQuest.id !== questId) return;
      const endTimestamp = Date.now();
      const completed: Quest = {
        ...activeQuest,
        status: "completed",
        endVideo,
        endTimestamp,
        durationMs: Math.max(0, endTimestamp - activeQuest.startTimestamp),
      };
      setCompletedQuests((current) => [completed, ...current]);
      clearPersistedActiveQuest();
    },
    [activeQuest, clearPersistedActiveQuest],
  );

  // active(あれば先頭) + 完了済み
  const quests = useMemo<Quest[]>(
    () => (activeQuest ? [activeQuest, ...completedQuests] : completedQuests),
    [activeQuest, completedQuests],
  );

  const value = useMemo<QuestContextValue>(
    () => ({ quests, activeQuest, hydrated, addQuest, completeQuest }),
    [quests, activeQuest, hydrated, addQuest, completeQuest],
  );

  return <QuestContext.Provider value={value}>{children}</QuestContext.Provider>;
}

export function useQuestContext(): QuestContextValue {
  const context = useContext(QuestContext);
  if (!context) {
    throw new Error("useQuestContext must be used within a QuestProvider.");
  }
  return context;
}