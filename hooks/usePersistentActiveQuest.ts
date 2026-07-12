"use client";

import { useCallback, useEffect, useState } from "react";
import {
  clearActiveQuestMeta,
  loadActiveQuestMeta,
  saveActiveQuestMeta,
} from "@/lib/activeQuestStorage";
import { deleteVideoBlob, getVideoBlob, saveVideoBlob } from "@/lib/videoStorage";
import type { Quest } from "@/types/quest";

export interface UsePersistentActiveQuestResult {
  activeQuest: Quest | null;
  hydrated: boolean;
  persistActiveQuest: (quest: Quest, startBlob: Blob) => void;
  clearPersistedActiveQuest: () => void;
}

/**
 * ACTIVEクエストの永続化:
 * - メタデータ(JSON)は localStorage
 * - 動画Blobは IndexedDB
 * リロード時はBlobを読み直し、URL.createObjectURL で新しいセッションURLを作り直す。
 */
export function usePersistentActiveQuest(): UsePersistentActiveQuestResult {
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const meta = loadActiveQuestMeta();
      if (!meta) {
        if (!cancelled) setHydrated(true);
        return;
      }
      const blob = await getVideoBlob(meta.videoId);
      if (cancelled) return;
      if (!blob || blob.size === 0) {
        clearActiveQuestMeta();
        setHydrated(true);
        return;
      }
      const uri = URL.createObjectURL(blob);
      const quest: Quest = {
        id: meta.questId,
        questName: meta.questTitle,
        status: "active",
        startVideo: {
          id: meta.videoId,
          kind: "start",
          uri,
          posterUri: null,
          durationMs: meta.durationMs,
          width: null,
          height: null,
          createdAt: meta.startedAt,
        },
        endVideo: null,
        startTimestamp: meta.startedAt,
        endTimestamp: null,
        durationMs: null,
      };
      setActiveQuest(quest);
      setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persistActiveQuest = useCallback((quest: Quest, startBlob: Blob) => {
    setActiveQuest(quest);
    if (!quest.startVideo) return;
    saveActiveQuestMeta({
      questId: quest.id,
      questTitle: quest.questName,
      videoId: quest.startVideo.id,
      startedAt: quest.startTimestamp,
      status: "active",
      mimeType: startBlob.type,
      durationMs: quest.startVideo.durationMs,
    });
    void saveVideoBlob(quest.startVideo.id, startBlob).catch((error) => {
      console.error("[TRUZ] IndexedDB save failed:", error);
    });
  }, []);

  const clearPersistedActiveQuest = useCallback(() => {
    const meta = loadActiveQuestMeta();
    setActiveQuest(null);
    clearActiveQuestMeta();
    if (meta) {
      void deleteVideoBlob(meta.videoId).catch(() => undefined);
    }
  }, []);

  return { activeQuest, hydrated, persistActiveQuest, clearPersistedActiveQuest };
}