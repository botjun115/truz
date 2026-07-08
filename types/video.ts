export type VideoKind = "start" | "end" | "banner";

export interface VideoAsset {
  id: string;
  kind: VideoKind;
  uri: string;
  posterUri: string | null;
  durationMs: number;
  width: number | null;
  height: number | null;
  createdAt: number;
}
