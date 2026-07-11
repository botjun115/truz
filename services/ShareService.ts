import type { SharePayload, ShareTarget } from "@/types/share";
import { assertNever } from "@/utils/validation";

/** 共有の結果。呼び出し側が成否・フォールバックを判断できるようにする */
export type ShareResult =
  | { status: "shared" }
  | { status: "copied" }
  | { status: "unsupported" }
  | { status: "cancelled" }
  | { status: "error"; message: string };


function shareText(payload: SharePayload): string {
  return payload.url ? `${payload.text} ${payload.url}` : payload.text;
}

/** Web Share API(ネイティブ共有シート)を試す */
async function shareViaSystem(payload: SharePayload): Promise<ShareResult> {
  if (typeof navigator === "undefined") return { status: "unsupported" };
  const nav = navigator
  if (typeof nav.share !== "function") return { status: "unsupported" };

  const data: ShareData = {
    title: payload.title,
    text: payload.text,
    ...(payload.url ? { url: payload.url } : {}),
  };
  try {
    if (typeof nav.canShare === "function" && !nav.canShare(data)) {
      return { status: "unsupported" };
    }
    await nav.share(data);
    return { status: "shared" };
  } catch (error) {
    // ユーザーがシートを閉じた場合は AbortError
    if (error instanceof DOMException && error.name === "AbortError") {
      return { status: "cancelled" };
    }
    return { status: "error", message: error instanceof Error ? error.message : "Share failed." };
  }
}

async function copyLink(payload: SharePayload): Promise<ShareResult> {
  const value = shareText(payload);
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(value);
      return { status: "copied" };
    }
    return { status: "unsupported" };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "Copy failed." };
  }
}

/** 新規タブでWeb Intent URLを開く(X / LINE / Facebook等) */
function openIntent(url: string): ShareResult {
  if (typeof window === "undefined") return { status: "unsupported" };
  window.open(url, "_blank", "noopener,noreferrer");
  return { status: "shared" };
}

function buildIntentUrl(target: ShareTarget, payload: SharePayload): string | null {
  const text = encodeURIComponent(payload.text);
  const url = payload.url ? encodeURIComponent(payload.url) : "";
  switch (target) {
    case "x":
      return `https://twitter.com/intent/tweet?text=${text}${url ? `&url=${url}` : ""}`;
    case "line":
      return `https://social-plugins.line.me/lineit/share?url=${url || encodeURIComponent(payload.text)}`;
    case "instagramStories":
      // InstagramはWeb Intentが無いためシステム共有かコピーに委譲する(呼び出し側で処理)
      return null;
    case "copyLink":
    case "system":
      return null;
    default:
      return assertNever(target);
  }
}

/**
 * 共有サービス。
 * - "system": Web Share API(スマホのネイティブ共有シート)
 * - "x" / "line": Web Intent URLを新規タブで開く
 * - "copyLink": クリップボードへコピー
 * - "instagramStories": Web公開APIが無いため、system→copyの順にフォールバック
 * 将来Firebase StorageのURLをpayload.urlに載せれば、そのまま各所へ共有できる。
 */
export const ShareService = {
  async share(target: ShareTarget, payload: SharePayload): Promise<ShareResult> {
    switch (target) {
      case "system":
        return shareViaSystem(payload);
      case "copyLink":
        return copyLink(payload);
      case "x":
      case "line": {
        const intentUrl = buildIntentUrl(target, payload);
        return intentUrl ? openIntent(intentUrl) : { status: "unsupported" };
      }
      case "instagramStories": {
        const viaSystem = await shareViaSystem(payload);
        if (viaSystem.status === "shared" || viaSystem.status === "cancelled") return viaSystem;
        return copyLink(payload);
      }
      default:
        return assertNever(target);
    }
  },

  /** Web Share APIが使えるか(呼び出し側のUI分岐用) */
  canUseSystemShare(): boolean {
    if (typeof navigator === "undefined") return false;
    return typeof navigator.share === "function";
  },
};