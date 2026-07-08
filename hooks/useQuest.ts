"use client";

import { useCallback } from "react";
import { useQuestContext } from "@/context/QuestContext";
import type { Quest } from "@/types/quest";
import type { VideoAsset } from "@/types/video";
import { generateId } from "@/utils/id";

export interface PublishStartQuestInput {
  questName: string;
  startVideo: VideoAsset;
}

export interface UseQuestResult {
  quests: Quest[];
  publishStartQuest: (input: PublishStartQuestInput) => Quest;
}

/**
 * START Questを公開用のQuestオブジェクトに組み立て、QuestContextへ追加する。
 * (Phase 2は擬似アップロードのため、ローカルのContextにのみ積む)
 */
export function useQuest(): UseQuestResult {
  const { quests, addQuest } = useQuestContext();

  const publishStartQuest = useCallback(
    ({ questName, startVideo }: PublishStartQuestInput): Quest => {
      const now = Date.now();
      const quest: Quest = {
        id: generateId("quest"),
        questName,
        status: "active",
        startVideo,
        endVideo: null,
        startTimestamp: now,
        endTimestamp: null,
        durationMs: null,
      };
      addQuest(quest);
      return quest;
    },
    [addQuest],
  );

  return { quests, publishStartQuest };
}