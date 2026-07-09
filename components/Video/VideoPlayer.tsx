"use client";

export interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  objectPosition?: string;
}

/** ループ・ミュート・コントロールなしの提示用プレイヤー */
export function VideoPlayer({ src, poster, className = "", objectPosition }: VideoPlayerProps) {
  if (!src) {
    console.error("[TRUZ] VideoPlayer: src is empty");
    return null;
  }
  return (
    <video
      src={src}
      poster={poster}
      autoPlay
      loop
      muted
      playsInline
      controls={false}
      className={`h-full w-full rounded-media object-cover ${className}`}
      style={objectPosition ? { objectPosition } : undefined}
      onError={(e) => {
        console.error("[TRUZ] VideoPlayer failed to load:", src.slice(0, 40), e);
      }}
    />
  );
}