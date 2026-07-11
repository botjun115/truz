import type { UserProfile } from "@/types/profile";

const STORAGE_KEY = "truz-profile-v1";

export const DEFAULT_PROFILE: UserProfile = {
  id: "user_me",
  name: "You",
  bio: "",
  avatarDataUrl: null,
  coverDataUrl: null,
  isPrivate: false,
  theme: "dark",
  followingCount: 20,
  followerCount: 120,
  totalLikes: 500,
  totalViews: 1200,
};

function isUserProfile(value: unknown): value is UserProfile {
  if (typeof value !== "object" || value === null) return false;
  const p = value as Record<string, unknown>;
  return (
    typeof p.id === "string" &&
    typeof p.name === "string" &&
    typeof p.bio === "string" &&
    (p.avatarDataUrl === null || typeof p.avatarDataUrl === "string") &&
    (p.coverDataUrl === null || typeof p.coverDataUrl === "string") &&
    typeof p.isPrivate === "boolean" &&
    (p.theme === "dark" || p.theme === "light" || p.theme === "system") &&
    typeof p.followingCount === "number" &&
    typeof p.followerCount === "number" &&
    typeof p.totalLikes === "number" &&
    typeof p.totalViews === "number"
  );
}

export function loadProfile(): UserProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed: unknown = JSON.parse(raw);
    if (isUserProfile(parsed)) return parsed;
    return DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // 容量超過(大きな画像)などは握りつぶす。保存はベストエフォート。
  }
}