import type { SupportReactionType } from "./reaction";

export type NotificationType = "reaction" | "system";

export interface AppNotification {
  id: string;
  type: NotificationType;
  message: string;
  reactionType: SupportReactionType | null;
  read: boolean;
  createdAt: number;
}
