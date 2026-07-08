/** 衝突しにくい短いIDを生成(クライアント用) */
export function generateId(prefix?: string): string {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  const time = Date.now().toString(36);
  return prefix ? `${prefix}_${time}${random}` : `${time}${random}`;
}
