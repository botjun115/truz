import { APP_NAME } from "@/constants/config";
import type { SharePayload } from "@/types/share";

/**
 * クエスト共有用のペイロードを組み立てる。
 * url は将来 Firebase Storage の公開URL(サムネイル/動画)に差し替え可能。
 * 現状はアプリのoriginを共有する(nullでも各共有先は安全に動作する)。
 */
export function buildQuestSharePayload(questName: string, shareUrl?: string | null): SharePayload {
  const trimmed = questName.trim();
  const text = trimmed
    ? `I just completed "${trimmed}" on ${APP_NAME}! 🔥`
    : `I just completed my challenge on ${APP_NAME}! 🔥`;
  const url =
    shareUrl ?? (typeof window !== "undefined" ? window.location.origin : null);
  return { title: APP_NAME, text, url };
}