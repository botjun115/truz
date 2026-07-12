"use client";

import { useCallback } from "react";
import { RECORD_DURATION_MS } from "@/constants/config";
import { useQuestContext } from "@/context/QuestContext";
import type { Quest } from "@/types/quest";
import type { RecordedVideo, VideoAsset } from "@/types/video";
import { generateId } from "@/utils/id";

export interface PublishStartQuestInput {
  questName: string;
  recorded: RecordedVideo;
}

export interface CompleteEndQuestInput {
  questId: string;
  recorded: RecordedVideo;
}

export interface UseQuestResult {
  quests: Quest[];
  publishStartQuest: (input: PublishStartQuestInput) => Quest;
  completeEndQuest: (input: CompleteEndQuestInput) => void;
}

function toVideoAsset(recorded: RecordedVideo, kind: "start" | "end"): VideoAsset {
  return {
    id: recorded.id,
    kind,
    uri: recorded.previewUrl,
    posterUri: null,
    durationMs: RECORD_DURATION_MS,
    width: null,
    height: null,
    createdAt: recorded.createdAt,
  };
}

/**
 * START Questの公開(active化)と、END動画付与によるCOMPLETED化を担う。
 * 録画BlobはaddQuestを通じてIndexedDBへ永続化される。
 */
export function useQuest(): UseQuestResult {
  const { quests, addQuest, completeQuest } = useQuestContext();

  const publishStartQuest = useCallback(
    ({ questName, recorded }: PublishStartQuestInput): Quest => {
      const now = Date.now();
      const quest: Quest = {
        id: generateId("quest"),
        questName,
        status: "active",
        startVideo: toVideoAsset(recorded, "start"),
        endVideo: null,
        startTimestamp: now,
        endTimestamp: null,
        durationMs: null,
      };
      addQuest(quest, recorded.blob);
      return quest;
    },
    [addQuest],
  );

  const completeEndQuest = useCallback(
    ({ questId, recorded }: CompleteEndQuestInput) => {
      completeQuest({ questId, endVideo: toVideoAsset(recorded, "end") });
    },
    [completeQuest],
  );

  return { quests, publishStartQuest, completeEndQuest };
}