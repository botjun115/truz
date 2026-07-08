export interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  objectPosition?: string;
}

/** ループ・ミュート・コントロールなしの提示用プレイヤー */
export function VideoPlayer({ src, poster, className = "", objectPosition }: VideoPlayerProps) {
  return (
    <video
      src={src}
      poster={poster}
      autoPlay
      loop
      muted
      playsInline
      className={`h-full w-full rounded-media object-cover ${className}`}
      style={objectPosition ? { objectPosition } : undefined}
    />
  );
}
