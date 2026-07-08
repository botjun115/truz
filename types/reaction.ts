export type SupportReactionType = "support" | "keepGoing" | "greatConsistency" | "doItTogether";

export interface SupportReaction {
  type: SupportReactionType;
  count: number;
}
