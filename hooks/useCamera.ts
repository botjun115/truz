"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CameraStatus = "idle" | "starting" | "live" | "error";
export type FacingMode = "user" | "environment";

export interface UseCameraResult {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  stream: MediaStream | null;
  status: CameraStatus;
  error: string | null;
  facingMode: FacingMode;
  start: (facing?: FacingMode) => Promise<void>;
  flip: () => Promise<void>;
  stop: () => void;
}

/**
 * カメラのライブプレビューを管理する。
 * facingMode("user"/"environment")を切替可能。切替時は現在のストリームを停止して再取得する。
 * 録画自体は useRecording が担当。
 */
export function useCamera(): UseCameraResult {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [status, setStatus] = useState<CameraStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<FacingMode>("user");

  const stopTracks = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    stopTracks();
    setStream(null);
    setStatus("idle");
  }, [stopTracks]);

  const start = useCallback(
    async (facing: FacingMode = facingMode) => {
      setStatus("starting");
      setError(null);
      stopTracks();
      try {
        const media = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facing,
            width: { ideal: 1080 },
            height: { ideal: 1920 },
          },
          audio: true,
        });
        streamRef.current = media;
        setStream(media);
        setFacingMode(facing);
        if (videoRef.current) {
          videoRef.current.srcObject = media;
          await videoRef.current.play().catch(() => undefined);
        }
        setStatus("live");
      } catch {
        setStatus("error");
        setError("カメラを起動できませんでした。権限を確認してください。");
      }
    },
    [facingMode, stopTracks],
  );

  const flip = useCallback(async () => {
    await start(facingMode === "user" ? "environment" : "user");
  }, [facingMode, start]);

  useEffect(() => () => stopTracks(), [stopTracks]);

  return { videoRef, stream, status, error, facingMode, start, flip, stop };
}