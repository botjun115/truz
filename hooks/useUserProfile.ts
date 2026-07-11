"use client";

import { useCallback, useEffect, useState } from "react";
import { DEFAULT_PROFILE, loadProfile, saveProfile } from "@/lib/profileStorage";
import type { ProfileThemePreference, UserProfile } from "@/types/profile";

export interface UseUserProfileResult {
  profile: UserProfile;
  hydrated: boolean;
  update: (patch: Partial<UserProfile>) => void;
}

/**
 * 編集可能プロフィールのローカル状態フック(既存ProfileContextとは独立)。
 * - 初回マウントでlocalStorageから復元(SSR安全)
 * - update()で部分更新し即保存
 * - テーマ設定を document.documentElement.dataset.theme に反映(既存の[data-theme]方式に協調)
 */
export function useUserProfile(): UseUserProfileResult {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loaded = loadProfile();
    setProfile(loaded);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    applyTheme(profile.theme);
  }, [profile.theme, hydrated]);

  const update = useCallback((patch: Partial<UserProfile>) => {
    setProfile((current) => {
      const next = { ...current, ...patch };
      saveProfile(next);
      return next;
    });
  }, []);

  return { profile, hydrated, update };
}

/** dark/light/system を [data-theme] へ反映する(systemは端末のprefers-color-schemeに従う) */
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