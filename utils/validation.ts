import { MAX_QUEST_NAME_LENGTH } from "@/constants/config";

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isValidQuestName(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= MAX_QUEST_NAME_LENGTH;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** 網羅チェック用: unionの分岐漏れをコンパイル時に検出する */
export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${String(value)}`);
}
