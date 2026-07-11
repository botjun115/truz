"use client";

import { useRouter } from "next/navigation";
import { Settings } from "lucide-react";
import { ProfileAvatar } from "@/components/Profile/ProfileAvatar";
import { ROUTES } from "@/constants/routes";
import type { UserProfile } from "@/types/profile";

export interface ProfileHeaderProps {
  profile: UserProfile;
  /** 他人のプロフィールならFollowボタンを出せる設計(自分のときは非表示) */
  isOwnProfile?: boolean;
}

/** カバー背景 + 重なるアバター + 名前/自己紹介 + 右上の歯車 */
export function ProfileHeader({ profile, isOwnProfile = true }: ProfileHeaderProps) {
  const router = useRouter();
  const coverStyle = profile.coverDataUrl
    ? { backgroundImage: `url(${profile.coverDataUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
    : {
        backgroundImage:
          "linear-gradient(160deg, rgba(0,255,102,0.14) 0%, rgba(0,0,0,0.2) 45%, rgba(0,0,0,0.6) 100%)",
      };

  return (
    <div>
      <div className="relative h-40 w-full" style={coverStyle}>
        <button
          type="button"
          onClick={() => router.push(ROUTES.settings)}
          aria-label="Settings"
          className="absolute right-4 top-[calc(env(safe-area-inset-top)+12px)] flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm"
        >
          <Settings size={20} />
        </button>
      </div>

      <div className="px-5">
        <div className="-mt-9 flex items-end justify-between">
          <ProfileAvatar
            name={profile.name}
            avatarDataUrl={profile.avatarDataUrl}
            size={76}
            className="border-4 border-bg"
          />
          {!isOwnProfile ? (
            <button
              type="button"
              className="mb-2 rounded-control border border-accent px-5 py-2 text-sm font-semibold text-accent"
            >
              Follow
            </button>
          ) : null}
        </div>

        <h1 className="mt-3 text-xl font-bold text-ink">{profile.name}</h1>
        {profile.bio ? (
          <p className="mt-1 whitespace-pre-wrap text-sm text-soft">{profile.bio}</p>
        ) : null}
      </div>
    </div>
  );
}