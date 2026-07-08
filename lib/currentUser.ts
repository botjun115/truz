import type { User } from "@/types/user";

/** Phase 2の擬似ログインユーザー(自分の投稿の表示用) */
export const CURRENT_USER: User = {
  id: "user_me",
  displayName: "You",
  avatarUrl: null,
  createdAt: Date.now(),
};