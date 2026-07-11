"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { UserProfile } from "@/types/profile";
import { notImplemented } from "@/utils/errors";

export type ProfileStatus = "idle" | "loading" | "ready" | "error";

interface ProfileContextValue {
  profile: UserProfile | null;
  status: ProfileStatus;
  refresh: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile] = useState<UserProfile | null>(null);
  const [status] = useState<ProfileStatus>("idle");

  const refresh = useCallback(async () => notImplemented("ProfileContext.refresh"), []);

  const value = useMemo<ProfileContextValue>(
    () => ({ profile, status, refresh }),
    [profile, status, refresh],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfileContext(): ProfileContextValue {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfileContext must be used within a ProfileProvider.");
  }
  return context;
}
