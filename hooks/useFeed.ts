"use client";

import { useFeedContext } from "@/context/FeedContext";

/** フィード状態への公開フック(実装はFeedContextに集約) */
export function useFeed() {
  return useFeedContext();
}
