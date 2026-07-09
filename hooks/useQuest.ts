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

export interface CompleteEndQuestInput {
  questId: string;
  endVideo: VideoAsset;
}

export interface UseQuestResult {
  quests: Quest[];
  publishStartQuest: (input: PublishStartQuestInput) => Quest;
  completeEndQuest: (input: CompleteEndQuestInput) => void;
}

/**
 * START Questの公開(active化)と、END動画付与によるCOMPLETED化を担う。
 * (Phase 2は擬似アップロードのため、ローカルのContextにのみ反映)
 */
export function useQuest(): UseQuestResult {
  const { quests, addQuest, completeQuest } = useQuestContext();

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

  const completeEndQuest = useCallback(
    ({ questId, endVideo }: CompleteEndQuestInput) => {
      completeQuest({ questId, endVideo });
    },
    [completeQuest],
  );

  return { quests, publishStartQuest, completeEndQuest };
}