"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ProfileHeader } from "@/components/Profile/ProfileHeader";
import { ProfilePostGrid } from "@/components/Profile/ProfilePostGrid";
import { ProfileStats } from "@/components/Profile/ProfileStats";
import { SponsoredSlot } from "@/components/Profile/SponsoredSlot";
import { NavigationBar } from "@/components/Navigation/NavigationBar";
import { useQuestContext } from "@/context/QuestContext";
import { useUserProfile } from "@/hooks/useUserProfile";

/**
 * 自分のプロフィール画面。
 * 投稿グリッドのデータ元は既存のローカル投稿(useQuestContextのquests、読み取りのみ)。
 * 録画/投稿/シェア/カメラ処理には一切触れない。
 */
export function ProfileScreen() {
  const { profile, hydrated } = useUserProfile();
  const { quests } = useQuestContext();
  const router = useRouter();

  const myPosts = useMemo(
    () => quests.filter((quest) => quest.startVideo !== null),
    [quests],
  );

  return (
    <div className="page-shell">
      <main className="flex-1 pb-24">
        <ProfileHeader profile={profile} isOwnProfile />

        <div className="mt-5 px-5">
          <ProfileStats
            followingCount={profile.followingCount}
            followerCount={profile.followerCount}
            totalLikes={profile.totalLikes}
            totalViews={profile.totalViews}
          />
        </div>

        <div className="mt-5 px-5">
          <SponsoredSlot />
        </div>

        <div className="mt-6 px-5">
          <h2 className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-soft">
            Posts
          </h2>
          {hydrated ? (
            <ProfilePostGrid quests={myPosts} onSelect={() => router.push("/")} />
          ) : null}
        </div>
      </main>
      <NavigationBar />
    </div>
  );
}