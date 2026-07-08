"use client";

export interface CountdownOverlayProps {
  seconds: number;
  visible: boolean;
}

/** 録画前のカウントダウン表示オーバーレイ */
export function CountdownOverlay({ seconds, visible }: CountdownOverlayProps) {
  if (!visible) return null;
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40">
      <span className="font-display text-7xl font-bold text-white">{seconds}</span>
    </div>
  );
}
