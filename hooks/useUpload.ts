"use client";

import { useCallback, useState } from "react";
import type { UploadResult, UploadVideoInput } from "@/lib/firebase/upload";
import { notImplemented } from "@/utils/errors";

export type UploadStatus = "idle" | "uploading" | "done" | "error";

export interface UseUploadResult {
  status: UploadStatus;
  progress: number;
  error: string | null;
  upload: (input: UploadVideoInput) => Promise<UploadResult>;
  reset: () => void;
}

/** 動画アップロード。アップロードロジックはPhase 2で実装する。 */
export function useUpload(): UseUploadResult {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress] = useState(0);
  const [error] = useState<string | null>(null);

  const upload = useCallback(
    async (_input: UploadVideoInput) => notImplemented("useUpload.upload"),
    [],
  );
  const reset = useCallback(() => setStatus("idle"), []);

  return { status, progress, error, upload, reset };
}
