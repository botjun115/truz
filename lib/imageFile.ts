/**
 * 画像ファイルの読み込みユーティリティ。
 * localStorageに収めるため、Data URL化の前に必ず縮小・圧縮する(Blob URLは長期保存しない)。
 */

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("画像の読み込みに失敗しました。"));
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("画像を表示できませんでした。"));
    img.src = dataUrl;
  });
}

/**
 * 画像を最大辺 maxSize に収まるよう縮小し、JPEGのData URLで返す。
 * localStorageの容量制限(約5MB)に収まるサイズにする。
 */
export async function imageFileToResizedDataUrl(file: File, maxSize: number): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("画像ファイルを選択してください。");
  }
  const rawDataUrl = await readAsDataUrl(file);
  const img = await loadImage(rawDataUrl);

  const { width, height } = img;
  const scale = Math.min(1, maxSize / Math.max(width, height));
  const targetW = Math.max(1, Math.round(width * scale));
  const targetH = Math.max(1, Math.round(height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return rawDataUrl;
  }
  ctx.drawImage(img, 0, 0, targetW, targetH);
  return canvas.toDataURL("image/jpeg", 0.7);
}