export function isVideoFile(file: File): boolean {
  return file.type.startsWith("video/");
}

export function createVideoObjectUrl(source: Blob): string {
  return URL.createObjectURL(source);
}

export function revokeVideoObjectUrl(url: string): void {
  try {
    URL.revokeObjectURL(url);
  } catch {
    // 失効済みURLは無視する
  }
}
