"use client";

import { useProfileContext } from "@/context/ProfileContext";

/** プロフィール状態への公開フック(実装はProfileContextに集約) */
export function useProfile() {
  return useProfileContext();
}
