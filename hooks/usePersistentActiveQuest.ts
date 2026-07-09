"use client";

import { useCallback, useEffect, useState } from "react";
import { clearActiveQuest, loadActiveQuest, saveActiveQuest } from "@/lib/activeQuestStorage";
import type { Quest } from "@/types/quest";

export interface UsePersistentActiveQuestResult {
  activeQuest: Quest | null;
  hydrated: boolean;
  persistActiveQuest: (quest: Quest) => void;
  clearPersistedActiveQuest: () => void;
}

/**
 * ACTIVEクエストをlocalStorageと同期するフック。
 * - 初回マウントで復元(リロード・アプリ再開後もACTIVEカードが残る)
 * - 経過時間はここでは扱わず、常に Date.now() - startTimestamp で別途計算する
 */
export function usePersistentActiveQuest(): UsePersistentActiveQuestResult {
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // 初回のみlocalStorageから復元(SSRとのhydration不一致を避けるためmount後)
  useEffect(() => {
    setActiveQuest(loadActiveQuest());
    setHydrated(true);
  }, []);

  const persistActiveQuest = useCallback((quest: Quest) => {
    setActiveQuest(quest);
    saveActiveQuest(quest);
  }, []);

  const clearPersistedActiveQuest = useCallback(() => {
    setActiveQuest(null);
    clearActiveQuest();
  }, []);

  return { activeQuest, hydrated, persistActiveQuest, clearPersistedActiveQuest };
}