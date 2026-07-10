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
    const chunks: Blob[] = [];
    let recorder: MediaRecorder;
    try {
      const mimeType = pickMimeType();
      console.log("[TRUZ] MediaRecorder mimeType:", mimeType || "(default)");
      recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    } catch (e) {
      console.error("[TRUZ] MediaRecorder init failed:", e);
      setStatus("error");
      setError("録画を開始できませんでした。");
      return;
    }
    recorderRef.current = recorder;

    recorder.ondataavailable = (event: BlobEvent) => {
      console.log("[TRUZ] ondataavailable chunk size:", event.data.size);
      if (event.data.size > 0) chunks.push(event.data);
    };

    recorder.onstop = () => {
      setStatus("processing");
      const actualMimeType =
  recorder.mimeType ||
  chunks.find((chunk) => chunk.type)?.type
  "video/mp4";

const blob = new Blob(chunks, {
  type: actualMimeType,
});
      console.log("Recorder MIME:", recorder.mimeType);

chunks.forEach((chunk, index) => {
  console.log(`Chunk ${index}:`, {
    size: chunk.size,
    type: chunk.type,
  });
});
      console.log("[TRUZ] === recording stopped ===");
      console.log("[TRUZ] blob size:", blob.size);
      console.log("[TRUZ] blob type:", blob.type);
      console.log("[TRUZ] chunks count:", chunks.length);

      if (blob.size === 0) {
        console.error("[TRUZ] BLOB IS EMPTY — 録画データが空です");
        setStatus("error");
        setError("録画データが空でした。");
        return;
      }

      // 参考: object URLも作ってログ(実保存はdata URL)
      const objUrl = URL.createObjectURL(blob);
      console.log("[TRUZ] object URL:", objUrl);

      blobToDataUrl(blob)
        .then((dataUrl) => {
          console.log("[TRUZ] data URL length:", dataUrl.length);
          console.log("[TRUZ] data URL prefix:", dataUrl.slice(0, 40));
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
          console.log("[TRUZ] VideoAsset created, uri length:", asset.uri.length);
          setResult(asset);
          setStatus("done");
        })
        .catch((e) => {
          console.error("[TRUZ] blobToDataUrl failed:", e);
          setStatus("error");
          setError("録画データの保存に失敗しました。");
        });
    };

    setStatus("recording");
    recorder.start();
    console.log("[TRUZ] recorder.start() called, state:", recorder.state);
    window.setTimeout(() => {
      console.log("[TRUZ] 3s timeout, recorder.state:", recorder.state);
      if (recorder.state !== "inactive") recorder.stop();
    }, RECORD_DURATION_MS);
  }, []);

  return { status, result, error, record, reset };
}