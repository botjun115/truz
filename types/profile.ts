export type ProfileThemePreference = "dark" | "light" | "system";

export interface UserProfile {
  id: string;
  name: string;
  bio: string;
  avatarDataUrl: string | null;
  coverDataUrl: string | null;
  isPrivate: boolean;
  theme: ProfileThemePreference;
  followingCount: number;
  followerCount: number;
  totalLikes: number;
  totalViews: number;
}