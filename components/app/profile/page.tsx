import type { Metadata } from "next";
import { ImageOff } from "lucide-react";
import { EmptyState } from "@/components/Feedback/EmptyState";
import { Header } from "@/components/Header/Header";
import { NavigationBar } from "@/components/Navigation/NavigationBar";
import { Heatmap } from "@/components/Profile/Heatmap";
import { ProfileBanner } from "@/components/Profile/ProfileBanner";
import { HEATMAP_WEEKS } from "@/constants/config";

export const metadata: Metadata = { title: "Profile" };

export default function ProfilePage() {
  const emptyHeatmap = Array.from({ length: HEATMAP_WEEKS * 7 }, () => 0);

  return (
    <div className="page-shell">
      <Header title="Profile" />
      <main className="page-content flex flex-col gap-6">
        <ProfileBanner />
        <section className="flex flex-col gap-3">
          <h2 className="font-display text-sm font-semibold">Consistency</h2>
          <Heatmap values={emptyHeatmap} />
        </section>
        <EmptyState
          icon={<ImageOff size={28} strokeWidth={1.6} />}
          title="No efforts yet."
          description="Completed quests will appear here."
        />
      </main>
      <NavigationBar />
    </div>
  );
}
