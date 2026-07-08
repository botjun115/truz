"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { Quest } from "@/types/quest";

interface QuestContextValue {
  quests: Quest[];
  activeQuest: Quest | null;
  addQuest: (quest: Quest) => void;
}

const QuestContext = createContext<QuestContextValue | null>(null);

/** 公開済みQuestをローカル保持する(Phase 2: Firebase未接続) */
export function QuestProvider({ children }: { children: React.ReactNode }) {
  const [quests, setQuests] = useState<Quest[]>([]);

  const addQuest = useCallback((quest: Quest) => {
    setQuests((current) => [quest, ...current]);
  }, []);

  const activeQuest = useMemo(
    () => quests.find((quest) => quest.status === "active") ?? null,
    [quests],
  );

  const value = useMemo<QuestContextValue>(
    () => ({ quests, activeQuest, addQuest }),
    [quests, activeQuest, addQuest],
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