"use client";

import { useEffect } from "react";
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
}

/**
 * フルスクリーンCamera制御:
 * カメラ起動 → 3・2・1カウントダウン → 自動で正確に3秒録画 → 完了で親へ受け渡し。
 * ユーザーはRecordを押さない。kindでSTART/ENDを切り替える。
 */
export function CameraLauncher({ kind, onRecorded }: CameraLauncherProps) {
  const camera = useCamera();
  const recording = useRecording();

  const countdown = useCountdown(3, () => {
    if (camera.stream) recording.record(camera.stream, kind);
  });

  // カメラ起動
  useEffect(() => {
    camera.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ライブになったらカウントダウン開始
  useEffect(() => {
    if (camera.status === "live" && !countdown.isRunning && countdown.count === 3) {
      countdown.start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera.status]);

  // 録画完了 → 停止して親へ
  useEffect(() => {
    if (recording.status === "done" && recording.result) {
      camera.stop();
      onRecorded(recording.result);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recording.status, recording.result]);

  const showCountdown = camera.status === "live" && countdown.isRunning;
  const showRecording = recording.status === "recording";

  return (
    <div className="fixed inset-0 z-50 mx-auto max-w-md bg-black">
      <CameraView videoRef={camera.videoRef} status={camera.status} error={camera.error}>
        <Countdown count={countdown.count} visible={showCountdown} />
        <RecordingOverlay visible={showRecording} />
      </CameraView>
    </div>
  );
}