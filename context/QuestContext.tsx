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
  addQuest: (quest: Quest, startBlob: Blob) => void;
  completeQuest: (input: CompleteQuestInput) => void;
}

const QuestContext = createContext<QuestContextValue | null>(null);

export function QuestProvider({ children }: { children: React.ReactNode }) {
  const { activeQuest, hydrated, persistActiveQuest, clearPersistedActiveQuest } =
    usePersistentActiveQuest();

  const [completedQuests, setCompletedQuests] = useState<Quest[]>([]);

  const addQuest = useCallback(
    (quest: Quest, startBlob: Blob) => {
      persistActiveQuest(quest, startBlob);
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