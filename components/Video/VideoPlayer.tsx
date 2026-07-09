"use client";

export interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
}

/**
 * 再利用可能なポートレート動画プレイヤー。
 * 親が 9:16 の枠(overflow-hidden + rounded)を持つ前提で全面を cover で埋める。
 * srcがある限り黒プレースホルダーは出さない(必ず<video>を描画)。
 */
export function VideoPlayer({ src, poster, className = "" }: VideoPlayerProps) {
  if (!src) {
    if (process.env.NODE_ENV !== "production") {
      return (
        <div className="flex h-full w-full items-center justify-center bg-black text-center font-mono text-[10px] text-danger">
          NO VIDEO URL
        </div>
      );
    }
    return null;
  }
  return (
    <video
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      className={`h-full w-full bg-black object-cover ${className}`}
      style={{ borderRadius: "inherit" }}
    />
  );
}