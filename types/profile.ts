import type { User } from "./user";
import type { VideoAsset } from "./video";

export interface ProfileStats {
  completedCount: number;
  totalDurationMs: number;
  currentStreak: number;
  bestStreak: number;
}

export interface Profile {
  user: User;
  stats: ProfileStats;
  bannerVideo: VideoAsset | null;
  heatmap: number[];
}
