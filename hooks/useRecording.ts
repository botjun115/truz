"use client";

import { useCallback, useRef, useState } from "react";
import { RECORD_DURATION_MS } from "@/constants/config";
import type { VideoAsset, VideoKind } from "@/types/video";
import { blobToDataUrl } from "@/utils/blob";
import { generateId } from "@/utils/id";

export type RecordingStatus = "idle" | "recording" | "processing" | "done" | "error";

export interface UseRecordingResult {
  status: RecordingStatus;
  result: VideoAsset | null;
  error: string | null;
  record: (stream: MediaStream, kind: VideoKind) => void;
  reset: () => void;
}

function pickMimeType(): string {
  const candidates = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm", "video/mp4"];
  for (const type of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return "";
}

/**
 * ストリームを正確に RECORD_DURATION_MS だけ録画し、VideoAsset を生成する。
 * uri は data URL にする(localStorage永続化後、リロードしても再生できるように)。
 */
export function useRecording(): UseRecordingResult {
  const [status, setStatus] = useState<RecordingStatus>("idle");
  const [result, setResult] = useState<VideoAsset | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);

  const reset = useCallback(() => {
    setStatus("idle");
    setResult(null);
    setError(null);
    recorderRef.current = null;
  }, []);

  const record = useCallback((stream: MediaStream, kind: VideoKind) => {
    setError(null);
    setResult(null);
    const chunks: BlobPart[] = [];
    let recorder: MediaRecorder;
    try {
      const mimeType = pickMimeType();
      recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    } catch {
      setStatus("error");
      setError("録画を開始できませんでした。");
      return;
    }
    recorderRef.current = recorder;

    recorder.ondataavailable = (event: BlobEvent) => {
      if (event.data.size > 0) chunks.push(event.data);
    };
    recorder.onstop = () => {
      setStatus("processing");
      const blob = new Blob(chunks, { type: recorder.mimeType || "video/webm" });
      blobToDataUrl(blob)
        .then((dataUrl) => {
          const asset: VideoAsset = {
            id: generateId("vid"),
            kind,
            uri: dataUrl,
            posterUri: null,
            durationMs: RECORD_DURATION_MS,
            width: null,
            height: null,
            createdAt: Date.now(),
          };
          setResult(asset);
          setStatus("done");
        })
        .catch(() => {
          setStatus("error");
          setError("録画データの保存に失敗しました。");
        });
    };

    setStatus("recording");
    recorder.start();
    window.setTimeout(() => {
      if (recorder.state !== "inactive") recorder.stop();
    }, RECORD_DURATION_MS);
  }, []);

  return { status, result, error, record, reset };
}