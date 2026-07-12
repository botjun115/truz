"use client";

import { useRouter } from "next/navigation";
import { Settings } from "lucide-react";
import { ProfileAvatar } from "@/components/Profile/ProfileAvatar";
import { ROUTES } from "@/constants/routes";
import type { UserProfile } from "@/types/profile";

export interface ProfileHeaderProps {
  profile: UserProfile;
  /** 他人のプロフィールならFollowボタンを出せる設計 */
  isOwnProfile?: boolean;
}

export function ProfileHeader({
  profile,
  isOwnProfile = true,
}: ProfileHeaderProps) {
  const router = useRouter();

  const coverStyle = profile.coverDataUrl
    ? {
        backgroundImage: `url(${profile.coverDataUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {
        backgroundImage:
          "linear-gradient(160deg, rgba(0,255,102,0.14) 0%, rgba(0,0,0,0.2) 45%, rgba(0,0,0,0.6) 100%)",
      };
      return (
        <div className="pb-12">
      <div
        className="relative h-32 w-full"
        style={coverStyle}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

        <button
          type="button"
          onClick={() => router.push(ROUTES.settings)}
          aria-label="Settings"
          className="absolute right-4 top-[calc(env(safe-area-inset-top)+12px)] z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm"
        >
          <Settings size={20} />
        </button>
      </div>

      <div className="px-7">
        <div className="-mt-26 flex items-end justify-between">
          <div className="z-10 flex items-center gap-4">
            <ProfileAvatar
              name={profile.name}
              avatarDataUrl={profile.avatarDataUrl}
              size={76}
              className="border-4 border-bg"
            />

            <h1 className="text-2xl font-bold text-white">
              {profile.name}
            </h1>
          </div>

          {!isOwnProfile ? (
            <button
              type="button"
              className="rounded-control border border-accent px-5 py-2 text-sm font-semibold text-accent"
            >
              Follow
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}