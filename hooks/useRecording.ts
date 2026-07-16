"use client";

import { useCallback, useRef, useState } from "react";
import { RECORD_DURATION_MS } from "@/constants/config";
import type { VideoAsset, VideoKind } from "@/types/video";
import { generateId } from "@/utils/id";

export type RecordingStatus =
  | "idle"
  | "recording"
  | "processing"
  | "done"
  | "error";

export interface UseRecordingResult {
  status: RecordingStatus;
  result: VideoAsset | null;
  error: string | null;
  record: (stream: MediaStream, kind: VideoKind) => Promise<void>;
  reset: () => void;
}

const PORTRAIT_WIDTH = 720;
const PORTRAIT_HEIGHT = 1280;
const FRAME_RATE = 30;

export function useRecording(): UseRecordingResult {
  const [status, setStatus] = useState<RecordingStatus>("idle");
  const [result, setResult] = useState<VideoAsset | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const reset = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    setStatus("idle");
    setResult(null);
    setError(null);
    recorderRef.current = null;
  }, []);

  const record = useCallback(
    async (stream: MediaStream, kind: VideoKind): Promise<void> => {
      setError(null);
      setResult(null);

      if (typeof MediaRecorder === "undefined") {
        setStatus("error");
        setError("このブラウザーは動画録画に対応していません。");
        return;
      }

      const sourceVideo = document.createElement("video");
      sourceVideo.srcObject = stream;
      sourceVideo.muted = true;
      sourceVideo.playsInline = true;
      sourceVideo.autoplay = true;

      try {
        await sourceVideo.play();
      } catch (playError) {
        console.error("[TRUZ] source video play failed:", playError);
        setStatus("error");
        setError("カメラ映像を準備できませんでした。");
        return;
      }

      if (!sourceVideo.videoWidth || !sourceVideo.videoHeight) {
        await new Promise<void>((resolve) => {
          sourceVideo.onloadedmetadata = () => resolve();
        });
      }

      const canvas = document.createElement("canvas");
      canvas.width = PORTRAIT_WIDTH;
      canvas.height = PORTRAIT_HEIGHT;

      const context = canvas.getContext("2d");

      if (!context) {
        setStatus("error");
        setError("縦動画の作成に失敗しました。");
        return;
      }

      const drawFrame = () => {
        const sourceWidth = sourceVideo.videoWidth;
        const sourceHeight = sourceVideo.videoHeight;

        context.fillStyle = "#000000";
        context.fillRect(0, 0, PORTRAIT_WIDTH, PORTRAIT_HEIGHT);

        if (sourceWidth > 0 && sourceHeight > 0) {
          /*
           * object-containと同じ計算。
           * 横動画を無理に拡大・クロップせず、
           * 720×1280の縦動画内へ全体を収める。
           */
          const scale = Math.max(
            PORTRAIT_WIDTH / sourceWidth,
            PORTRAIT_HEIGHT / sourceHeight,
          );

          const drawWidth = sourceWidth * scale;
          const drawHeight = sourceHeight * scale;
          const drawX = (PORTRAIT_WIDTH - drawWidth) / 2;
          const drawY = (PORTRAIT_HEIGHT - drawHeight) / 2;

          context.drawImage(
            sourceVideo,
            drawX,
            drawY,
            drawWidth,
            drawHeight,
          );
        }

        animationFrameRef.current = requestAnimationFrame(drawFrame);
      };
      const videoTrack = stream.getVideoTracks()[0];
      const trackSettings = videoTrack?.getSettings();
      drawFrame();

      const canvasStream = canvas.captureStream(FRAME_RATE);

      /*
       * Canvasの映像には音声が含まれないため、
       * 元のカメラstreamから音声trackを追加する。
       */
      stream.getAudioTracks().forEach((audioTrack) => {
        canvasStream.addTrack(audioTrack);
      });

      const chunks: Blob[] = [];
      let recorder: MediaRecorder;

      try {
        /*
         * MIMEタイプは強制せず、
         * Safari・Chrome自身に対応形式を選ばせる。
         */
        recorder = new MediaRecorder(stream);

        console.log(
          "[TRUZ] Browser selected MediaRecorder mimeType:",
          recorder.mimeType || "(default)",
        );
      } catch (recorderError) {
        console.error("[TRUZ] MediaRecorder init failed:", recorderError);

        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }

        canvasStream.getVideoTracks().forEach((track) => track.stop());

        setStatus("error");
        setError("録画を開始できませんでした。");
        return;
      }

      recorderRef.current = recorder;

      recorder.ondataavailable = (event: BlobEvent) => {
        console.log("[TRUZ] chunk:", {
          size: event.data.size,
          type: event.data.type,
        });

        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onerror = (event: Event) => {
        console.error("[TRUZ] MediaRecorder error:", event);
        setStatus("error");
        setError("録画中にエラーが発生しました。");
      };

      recorder.onstop = () => {
        setStatus("processing");

        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }

        /*
         * Canvasの映像trackだけ停止する。
         * 元カメラの音声trackはここでは停止しない。
         */
        canvasStream.getVideoTracks().forEach((track) => track.stop());

        sourceVideo.pause();
        sourceVideo.srcObject = null;

        const actualMimeType =
          recorder.mimeType ||
          chunks.find((chunk) => chunk.type)?.type ||
          "video/mp4";

        const blob = new Blob(chunks, {
          type: actualMimeType,
        });

        console.log("[TRUZ] === recording stopped ===");
        console.log("[TRUZ] blob:", {
          size: blob.size,
          type: blob.type,
          chunks: chunks.length,
          width: PORTRAIT_WIDTH,
          height: PORTRAIT_HEIGHT,
        });

        if (blob.size === 0) {
          setStatus("error");
          setError("録画データが空でした。");
          return;
        }

        const objectUrl = URL.createObjectURL(blob);

        const asset: VideoAsset = {
          id: generateId("vid"),
          kind,
          uri: objectUrl,
          posterUri: null,
          durationMs: RECORD_DURATION_MS,
          width: PORTRAIT_WIDTH,
          height: PORTRAIT_HEIGHT,
          createdAt: Date.now(),
        };

        setResult(asset);
        setStatus("done");
      };

      setStatus("recording");

      /*
       * 250msごとにchunkを出すことで、
       * Safariで停止時の空Blobを起こしにくくする。
       */
      recorder.start(250);

      console.log("[TRUZ] recorder.start() called:", recorder.state);

      window.setTimeout(() => {
        console.log("[TRUZ] recording timeout:", recorder.state);

        if (recorder.state === "recording") {
          try {
            recorder.requestData();
          } catch {
            // requestData非対応時は無視する
          }

          recorder.stop();
        }
      }, RECORD_DURATION_MS);
    },
    [],
  );

  return {
    status,
    result,
    error,
    record,
    reset,
  };
}