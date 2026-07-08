import type { VideoKind } from "@/types/video";
import { notImplemented } from "@/utils/errors";

export interface UploadVideoInput {
  file: Blob;
  path: string;
  contentType: string;
}

export interface UploadResult {
  downloadUrl: string;
  path: string;
}

/** Storage上の動画パスを組み立てる */
export function buildVideoStoragePath(userId: string, questId: string, kind: VideoKind): string {
  return `videos/${userId}/${questId}/${kind}.mp4`;
}

/** 動画アップロード本体はPhase 2で実装する */
export function uploadVideo(_input: UploadVideoInput): Promise<UploadResult> {
  return notImplemented("lib/firebase/upload.uploadVideo");
}
