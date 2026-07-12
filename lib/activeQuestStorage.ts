/**
 * ACTIVEクエストのメタデータ永続化層(localStorage)。
 * 動画バイナリはここに入れない — 実Blobは lib/videoStorage.ts (IndexedDB) が持つ。
 * blob: URL はセッション限りのため保存しない(リロード時に作り直す)。
 */

export interface ActiveQuestMeta {
  questId: string;
  questTitle: string;
  videoId: string;
  startedAt: number;
  status: "active";
  mimeType: string;
  durationMs: number;
}

const STORAGE_KEY = "truz.activeQuestMeta.v2";
const LEGACY_KEY = "truz.activeQuest.v1";

function isActiveQuestMeta(value: unknown): value is ActiveQuestMeta {
  if (typeof value !== "object" || value === null) return false;
  const m = value as Record<string, unknown>;
  return (
    typeof m.questId === "string" &&
    typeof m.questTitle === "string" &&
    typeof m.videoId === "string" &&
    typeof m.startedAt === "number" &&
    m.status === "active" &&
    typeof m.mimeType === "string" &&
    typeof m.durationMs === "number"
  );
}

export function loadActiveQuestMeta(): ActiveQuestMeta | null {
  if (typeof window === "undefined") return null;
  try {
    // 旧形式(data URLを含む巨大データ)が残っていれば掃除する
    window.localStorage.removeItem(LEGACY_KEY);
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (isActiveQuestMeta(parsed)) return parsed;
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  } catch {
    return null;
  }
}

export function saveActiveQuestMeta(meta: ActiveQuestMeta): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(meta));
  } catch {
    // メタデータは小さいので通常失敗しない。失敗してもアプリは継続。
  }
}

export function clearActiveQuestMeta(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // 無視
  }
}