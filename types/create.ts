import type { VideoAsset } from "./video";

/** START Questフローの進行ステップ */
export type CreateStep = "closed" | "sheet" | "camera" | "review";

/** フロー中に持ち回る一時状態(投稿確定でリセット) */
export interface CreateDraft {
  questName: string;
  startVideo: VideoAsset | null;
}