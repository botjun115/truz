"use client";

import { useCallback, useState } from "react";
import { ShareService, type ShareResult } from "@/services/ShareService";
import type { SharePayload, ShareTarget } from "@/types/share";

export interface UseShareResult {
  canUseSystemShare: boolean;
  lastResult: ShareResult | null;
  share: (target: ShareTarget, payload: SharePayload) => Promise<ShareResult>;
}

/** ShareServiceの薄いラッパー。Web Share API可否と直近結果(コピー完了トースト等)を保持する */
export function useShare(): UseShareResult {
  const [lastResult, setLastResult] = useState<ShareResult | null>(null);

  const share = useCallback(async (target: ShareTarget, payload: SharePayload) => {
    const result = await ShareService.share(target, payload);
    setLastResult(result);
    return result;
  }, []);

  return {
    canUseSystemShare: ShareService.canUseSystemShare(),
    lastResult,
    share,
  };
}