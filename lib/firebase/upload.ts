import {
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "@/lib/firebase";
import type { VideoKind } from "@/types/video";

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
  return `videos/${userId}/${questId}/${kind}.webm`;
}

/**
 * 動画BlobをFirebase Storageにアップロードし、公開URLを返す。
 * このURLはリロード後も有効なので、フィードで再生してもblack画面にならない。
 */
export async function uploadVideo(input: UploadVideoInput): Promise<UploadResult> {
  const storageRef = ref(storage, input.path);
  await uploadBytes(storageRef, input.file, { contentType: input.contentType });
  const downloadUrl = await getDownloadURL(storageRef);
  return { downloadUrl, path: input.path };
}