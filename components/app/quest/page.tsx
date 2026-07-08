import type { Metadata } from "next";
import { Flag } from "lucide-react";
import { EmptyState } from "@/components/Feedback/EmptyState";
import { Header } from "@/components/Header/Header";
import { NavigationBar } from "@/components/Navigation/NavigationBar";

export const metadata: Metadata = { title: "Quest" };

export default function QuestPage() {
  return (
    <div className="page-shell">
      <Header title="Quest" />
      <main className="page-content">
        <EmptyState
          icon={<Flag size={32} strokeWidth={1.6} />}
          title="No quest selected."
          description="Quests appear in your feed once recorded."
        />
      </main>
      <NavigationBar />
    </div>
  );
}
