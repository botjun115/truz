import type { Metadata } from "next";
import { Share2 } from "lucide-react";
import { EmptyState } from "@/components/Feedback/EmptyState";
import { Header } from "@/components/Header/Header";
import { NavigationBar } from "@/components/Navigation/NavigationBar";

export const metadata: Metadata = { title: "Share" };

export default function SharePage() {
  return (
    <div className="page-shell">
      <Header title="Share" />
      <main className="page-content">
        <EmptyState
          icon={<Share2 size={32} strokeWidth={1.6} />}
          title="Nothing to share yet."
          description="Complete a quest to share your progress."
        />
      </main>
      <NavigationBar />
    </div>
  );
}
