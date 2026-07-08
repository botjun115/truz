"use client";

import { useEffect, useState } from "react";

/**
 * 経過時間(ms)を返す。常に Date.now() - startTimestamp で計算するため、
 * バックグラウンド復帰後も正しい値になる。
 */
export function useTimer(startTimestamp: number | null): number {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    if (startTimestamp === null) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [startTimestamp]);

  if (startTimestamp === null) return 0;
  return Math.max(0, now - startTimestamp);
}
