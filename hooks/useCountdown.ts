"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface UseCountdownResult {
  count: number;
  isRunning: boolean;
  start: () => void;
  reset: () => void;
}

/** from → 1 まで1秒ずつ減らし、0到達で onComplete を1度だけ呼ぶ */
export function useCountdown(from: number, onComplete?: () => void): UseCountdownResult {
  const [count, setCount] = useState(from);
  const [isRunning, setIsRunning] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!isRunning) return;
    if (count <= 0) {
      setIsRunning(false);
      onCompleteRef.current?.();
      return;
    }
    const timer = setTimeout(() => setCount((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [isRunning, count]);

  const start = useCallback(() => {
    setCount(from);
    setIsRunning(true);
  }, [from]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setCount(from);
  }, [from]);

  return { count, isRunning, start, reset };
}