"use client";

import { useEffect } from "react";
import { CameraControls } from "@/components/Camera/CameraControls";
import { CameraView } from "@/components/Camera/CameraView";
import { Countdown } from "@/components/Camera/Countdown";
import { RecordingOverlay } from "@/components/Camera/RecordingOverlay";
import { useCamera } from "@/hooks/useCamera";
import { useCountdown } from "@/hooks/useCountdown";
import { useRecording } from "@/hooks/useRecording";
import type { VideoAsset, VideoKind } from "@/types/video";

export interface CameraLauncherProps {
  kind: VideoKind;
  onRecorded: (video: VideoAsset) => void;
  onClose: () => void;
}

/**
 * フルスクリーン(ポートレート)Camera制御:
 * 録画ボタンで 3・2・1 カウントダウン → 自動で正確に3秒録画 → 自動停止 → 完了で親へ。
 * カメラ切替(前面/背面)と閉じるに対応。
 */
export function CameraLauncher({ kind, onRecorded, onClose }: CameraLauncherProps) {
  const camera = useCamera();
  const recording = useRecording();

  const countdown = useCountdown(3, () => {
    if (camera.stream) recording.record(camera.stream, kind);
  });

  // 初回カメラ起動(前面)
  useEffect(() => {
    camera.start("user");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 録画完了 → 停止して親へ
  useEffect(() => {
    if (recording.status === "done" && recording.result) {
      camera.stop();
      onRecorded(recording.result);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recording.status, recording.result]);

  const isBusy = countdown.isRunning || recording.status === "recording";
  const showCountdown = countdown.isRunning;
  const showRecording = recording.status === "recording";

  return (
    <div className="fixed inset-0 z-50 mx-auto flex max-w-md items-center justify-center bg-black">
      <CameraView videoRef={camera.videoRef} status={camera.status} error={camera.error}>
        <Countdown count={countdown.count} visible={showCountdown} />
        <RecordingOverlay visible={showRecording} />
        <CameraControls
          canRecord={camera.status === "live"}
          isRecording={isBusy}
          onRecord={countdown.start}
          onFlip={camera.flip}
          onClose={onClose}
        />
      </CameraView>
    </div>
  );
}