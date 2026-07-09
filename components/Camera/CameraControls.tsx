"use client";

import { motion } from "framer-motion";
import { SwitchCamera, X } from "lucide-react";

export interface CameraControlsProps {
  canRecord: boolean;
  isRecording: boolean;
  onRecord: () => void;
  onFlip: () => void;
  onClose: () => void;
}

/** カメラ操作UI: 左上に閉じる / 下中央に録画ボタン / 右下にカメラ切替 */
export function CameraControls({
  canRecord,
  isRecording,
  onRecord,
  onFlip,
  onClose,
}: CameraControlsProps) {
  return (
    <>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute left-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm"
      >
        <X size={20} />
      </button>

      <div className="absolute inset-x-0 bottom-8 z-30 flex items-center justify-center">
        <motion.button
          type="button"
          onClick={onRecord}
          disabled={!canRecord || isRecording}
          whileTap={canRecord && !isRecording ? { scale: 0.9 } : undefined}
          aria-label="Record"
          className="flex h-20 w-20 items-center justify-center rounded-full ring-4 ring-white/80 disabled:opacity-60"
        >
          <span
            className={`rounded-full bg-danger transition-all ${
              isRecording ? "h-7 w-7 rounded-lg" : "h-16 w-16"
            }`}
          />
        </motion.button>
      </div>

      <button
        type="button"
        onClick={onFlip}
        disabled={isRecording}
        aria-label="Flip camera"
        className="absolute bottom-[52px] right-6 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm disabled:opacity-50"
      >
        <SwitchCamera size={22} />
      </button>
    </>
  );
}