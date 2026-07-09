import type { VideoAsset } from "./video";

/** フローの進行ステップ */
export type CreateStep = "closed" | "sheet" | "camera" | "review";

/** 録画対象の種別(START新規作成 / 既存questのEND) */
export type CreateMode = "start" | "end";

/** フロー中に持ち回る一時状態(投稿確定でリセット) */
export interface CreateDraft {
  questName: string;
  startVideo: VideoAsset | null;
}