/** Blob を base64 data URL に変換する(リロード後も生き残る永続URL用) */
export function blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed to read blob."));
      reader.readAsDataURL(blob);
    });
  }