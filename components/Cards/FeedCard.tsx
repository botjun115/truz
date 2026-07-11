/** 設定テーマ(端末追従を含む。既存 ThemeMode は light|dark のため別途定義) */
export type ProfileThemePreference = "dark" | "light" | "system";

/**
 * 編集可能なユーザープロフィール。
 * localStorage("truz-profile-v1")に保存。将来Firestoreのドキュメントへそのまま移行しやすい平坦構造。
 * 画像はBlob URLではなくData URLで保存する(リロード後も復元できるように)。
 */
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