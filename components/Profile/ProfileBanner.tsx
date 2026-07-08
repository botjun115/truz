import { Plus } from "lucide-react";
import { VideoPlayer } from "@/components/Video/VideoPlayer";

export interface ProfileBannerProps {
  videoSrc?: string;
  posterSrc?: string;
  objectPositionX?: number;
  objectPositionY?: number;
}

/** プロフィール上部の細長いバナー(40:9) */
export function ProfileBanner({
  videoSrc,
  posterSrc,
  objectPositionX = 50,
  objectPositionY = 50,
}: ProfileBannerProps) {
  if (videoSrc) {
    return (
      <div className="aspect-[40/9] w-full overflow-hidden rounded-media">
        <VideoPlayer
          src={videoSrc}
          poster={posterSrc}
          objectPosition={`${objectPositionX}% ${objectPositionY}%`}
        />
      </div>
    );
  }
  return (
    <div className="flex aspect-[40/9] w-full items-center justify-center gap-2 rounded-media border border-dashed border-faint text-soft">
      <Plus size={16} />
      <span className="font-mono text-[10px] font-semibold tracking-wider">ADD BANNER</span>
    </div>
  );
}
