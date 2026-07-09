import type { Quest } from "@/types/quest";

/**
 * ACTIVEクエストのlocalStorage永続化層。
 * 動画URLはdata URLとして保存されている前提(リロード後も再生可能)。
 * Firebase接続時はこの層をサーバ同期に置き換える。
 */

const STORAGE_KEY = "truz.activeQuest.v1";

function isVideoAssetLike(value: unknown): boolean {
  if (value === null) return true;
  if (typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.uri === "string";
}

function isQuest(value: unknown): value is Quest {
  if (typeof value !== "object" || value === null) return false;
  const q = value as Record<string, unknown>;
  return (
    typeof q.id === "string" &&
    typeof q.questName === "string" &&
    q.status === "active" &&
    typeof q.startTimestamp === "number" &&
    isVideoAssetLike(q.startVideo)
  );
}

/** 保存されたACTIVEクエストを読む(壊れていれば破棄してnull) */
export function loadActiveQuest(): Quest | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (isQuest(parsed)) return parsed;
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  } catch {
    return null;
  }
}

/** ACTIVEクエストを保存する */
export function saveActiveQuest(quest: Quest): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(quest));
  } catch {
    // 容量超過などは無視(永続化はベストエフォート)
  }
}

/** ACTIVEクエストを消す(COMPLETED化・破棄時) */
export function clearActiveQuest(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // 無視
  }
}