"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_PROFILE, loadProfile, saveProfile } from "@/lib/profileStorage";
import type { ProfileThemePreference, UserProfile } from "@/types/profile";

export interface UseUserProfileResult {
  profile: UserProfile;
  hydrated: boolean;
  update: (patch: Partial<UserProfile>) => boolean;
}

/** dark/light/system を [data-theme] へ即時反映する(systemは端末設定に従う) */
export function applyTheme(theme: ProfileThemePreference): void {
  if (typeof document === "undefined") return;
  let resolved: "dark" | "light";
  if (theme === "system") {
    const prefersDark =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    resolved = prefersDark ? "dark" : "light";
  } else {
    resolved = theme;
  }
  document.documentElement.dataset.theme = resolved;
}

/**
 * 編集可能プロフィールのローカル状態フック(既存ProfileContextとは独立)。
 * Hook順序: useState → useRef → useEffect(初回読込) → useEffect(テーマ適用+system追従) → useCallback(update) → return
 */
export function useUserProfile(): UseUserProfileResult {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [hydrated, setHydrated] = useState(false);
  const profileRef = useRef<UserProfile>(DEFAULT_PROFILE);

  // 1. 初回マウントで1回だけ復元
  useEffect(() => {
    const loaded = loadProfile();
    profileRef.current = loaded;
    setProfile(loaded);
    setHydrated(true);
  }, []);

  // 2. テーマ適用 + system選択時は端末テーマ変更に追従(cleanupで解除)
  useEffect(() => {
    if (!hydrated) return;
    applyTheme(profile.theme);

    if (profile.theme !== "system") return;
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => applyTheme("system");
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, [profile.theme, hydrated]);

  // 3. 部分更新+即保存(保存成否を返す)
  const update = useCallback((patch: Partial<UserProfile>): boolean => {
    const next: UserProfile = { ...profileRef.current, ...patch };
    profileRef.current = next;
    setProfile(next);
    return saveProfile(next);
  }, []);

  return { profile, hydrated, update };
}