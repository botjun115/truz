import type { Metadata } from "next";
import { Search } from "lucide-react";
import { EmptyState } from "@/components/Feedback/EmptyState";
import { Header } from "@/components/Header/Header";
import { NavigationBar } from "@/components/Navigation/NavigationBar";

export const metadata: Metadata = { title: "Search" };

export default function SearchPage() {
  return (
    <div className="page-shell">
      <Header title="Search" />
      <main className="page-content">
        <EmptyState
          icon={<Search size={32} strokeWidth={1.6} />}
          title="Search"
          description="Find people, quests, and teams."
        />
      </main>
      <NavigationBar />
    </div>
  );
}
