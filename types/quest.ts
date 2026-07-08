import type { VideoAsset } from "./video";

export type QuestStatus = "active" | "completed";

export interface Quest {
  id: string;
  questName: string;
  status: QuestStatus;
  startVideo: VideoAsset | null;
  endVideo: VideoAsset | null;
  startTimestamp: number;
  endTimestamp: number | null;
  durationMs: number | null;
}

export interface CreateQuestInput {
  questName: string;
}
