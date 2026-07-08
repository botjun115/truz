export type ShareTarget = "instagramStories" | "x" | "line" | "copyLink" | "system";

export interface SharePayload {
  title: string;
  text: string;
  url: string | null;
}
