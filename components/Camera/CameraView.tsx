"use client";

import { Camera } from "lucide-react";
import type { CameraStatus } from "@/hooks/useCamera";

export interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  status: CameraStatus;
  error: string | null;
  children?: React.ReactNode;
}

/** フルスクリーンのカメラプレビュー面(オーバーレイをchildrenで重ねる) */
export function CameraView({ videoRef, status, error, children }: CameraViewProps) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`absolute inset-0 h-full w-full object-cover ${
          status === "live" ? "block" : "hidden"
        }`}
      />
      {status !== "live" ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/60">
          <Camera size={30} />
          <p className="px-8 text-center font-mono text-xs tracking-wider">
            {status === "error" ? error : "カメラを起動しています…"}
          </p>
        </div>
      ) : null}
      {children}
    </div>
  );
}