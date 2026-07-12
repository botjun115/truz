"use client";

import { useRouter } from "next/navigation";
import { FeedTabs } from "@/components/Feed/FeedTabs";
import { ProfileAvatar } from "@/components/Profile/ProfileAvatar";
import { APP_NAME } from "@/constants/config";
import { ROUTES } from "@/constants/routes";
import { useUserProfile } from "@/hooks/useUserProfile";
import type { FeedTab } from "@/types/feed";

export interface HomeHeaderProps {
  tab: FeedTab;
  onTabChange: (tab: FeedTab) => void;
}

/** Home専用ヘッダー: 左上プロフィールアイコン + ロゴ + タブ */
export function HomeHeader({ tab, onTabChange }: HomeHeaderProps) {
  const router = useRouter();
  const { profile } = useUserProfile();

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="px-5 pt-[calc(env(safe-area-inset-top)+16px)]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push(ROUTES.profile)}
            aria-label="Open profile"
            className="shrink-0"
          >
           <ProfileAvatar
  name={profile.name} avatarDataUrl={profile.avatarDataUrl} size={40}/>
          </button>
          <p className="font-sans text-[28px] font-bold leading-none tracking-[2px] text-ink">
            {APP_NAME} <span className="text-accent">•</span>
          </p>
        </div>
        <div className="mt-4">
          <FeedTabs tab={tab} onChange={onTabChange} />
        </div>
      </div>
    </header>
  );
}