import type { Quest } from "./quest";
import type { SupportReaction } from "./reaction";
import type { User } from "./user";

export type FeedTab = "following" | "forYou";

export interface FeedItem {
  id: string;
  author: User;
  quest: Quest;
  reactions: SupportReaction[];
  createdAt: number;
}
