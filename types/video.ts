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
export type FacingMode = "user" | "environment";

/** MediaRecorderの録画結果。実Blobとセッション用プレビューURL(objectURL)を保持する */
export interface RecordedVideo {
  id: string;
  blob: Blob;
  previewUrl: string;
  mimeType: string;
  size: number;
  createdAt: number;
  facingMode: FacingMode;
}