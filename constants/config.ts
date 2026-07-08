import type { ShareTarget } from "@/types/share";
import type { SupportReactionType } from "@/types/reaction";

export const APP_NAME = "TRUZ";
export const APP_TAGLINE = "Effort can be proven.";

export const RECORD_DURATION_MS = 3000;
export const MAX_QUEST_NAME_LENGTH = 40;
export const HEATMAP_WEEKS = 12;

export interface SupportReactionMeta {
  type: SupportReactionType;
  emoji: string;
  label: string;
}

export const SUPPORT_REACTIONS: readonly SupportReactionMeta[] = [
  { type: "support", emoji: "❤️", label: "Support" },
  { type: "keepGoing", emoji: "🔥", label: "Keep Going" },
  { type: "greatConsistency", emoji: "👏", label: "Great Consistency" },
  { type: "doItTogether", emoji: "💪", label: "Let's Do It Together" },
] as const;

export interface ShareTargetMeta {
  target: ShareTarget;
  label: string;
}

export const SHARE_TARGETS: readonly ShareTargetMeta[] = [
  { target: "instagramStories", label: "Instagram Stories" },
  { target: "x", label: "X (Twitter)" },
  { target: "line", label: "LINE" },
  { target: "copyLink", label: "Copy Link" },
  { target: "system", label: "More…" },
] as const;
