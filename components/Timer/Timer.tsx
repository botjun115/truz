"use client";

import { useTimer } from "@/hooks/useTimer";
import { formatTime } from "@/utils/time";

export interface TimerProps {
  startTimestamp: number | null;
}

/** startTimestamp からの経過時間を毎秒表示する */
export function Timer({ startTimestamp }: TimerProps) {
  const elapsedMs = useTimer(startTimestamp);
  return <span className="font-mono text-[13px] text-soft">{formatTime(elapsedMs)}</span>;
}
