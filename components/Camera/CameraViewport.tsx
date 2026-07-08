import { Camera } from "lucide-react";

export interface CameraViewportProps {
  videoRef?: React.Ref<HTMLVideoElement>;
  live?: boolean;
  overlay?: React.ReactNode;
}

/** カメラプレビューの提示用フレーム(ストリーム制御はuseCameraが担当) */
export function CameraViewport({ videoRef, live = false, overlay }: CameraViewportProps) {
  return (
    <div className="relative min-h-[340px] flex-1 overflow-hidden rounded-media bg-[#111111]">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`absolute inset-0 h-full w-full object-cover ${live ? "block" : "hidden"}`}
      />
      {!live ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[#8a8a87]">
          <Camera size={28} />
        </div>
      ) : null}
      <span className="absolute left-3 top-3 rounded-full bg-black/40 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider text-white backdrop-blur-sm">
        IN-APP CAMERA
      </span>
      {overlay}
    </div>
  );
}
