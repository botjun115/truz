"use client";

import { useCallback, useEffect, useState } from "react";
import { clearActiveQuestMeta } from "@/lib/activeQuestStorage";
import type { Quest } from "@/types/quest";

export interface UsePersistentActiveQuestResult {
  activeQuest: Quest | null;
  hydrated: boolean;
  persistActiveQuest: (quest: Quest) => void;
  clearPersistedActiveQuest: () => void;
}

export function usePersistentActiveQuest(): UsePersistentActiveQuestResult {
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const persistActiveQuest = useCallback((quest: Quest) => {
    setActiveQuest(quest);
  }, []);

  const clearPersistedActiveQuest = useCallback(() => {
    setActiveQuest(null);
    clearActiveQuestMeta();
  }, []);

  return {
    activeQuest,
    hydrated,
    persistActiveQuest,
    clearPersistedActiveQuest,
  };
}