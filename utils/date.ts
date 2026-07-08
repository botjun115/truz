export function startOfDay(timestamp: number): number {
  const d = new Date(timestamp);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function isSameDay(a: number, b: number): boolean {
  return startOfDay(a) === startOfDay(b);
}

/** ヒートマップ等のキーに使う YYYY-MM-DD */
export function toDayKey(timestamp: number): string {
  const d = new Date(timestamp);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** 今日を末尾として過去n日分のタイムスタンプ(各日の0時)を返す */
export function lastNDays(n: number, now: number = Date.now()): number[] {
  const today = startOfDay(now);
  const dayMs = 24 * 60 * 60 * 1000;
  return Array.from({ length: n }, (_, i) => today - (n - 1 - i) * dayMs);
}
