import type { Metadata } from "next";
import { Bell } from "lucide-react";
import { EmptyState } from "@/components/Feedback/EmptyState";
import { Header } from "@/components/Header/Header";
import { NavigationBar } from "@/components/Navigation/NavigationBar";

export const metadata: Metadata = { title: "Notifications" };

export default function NotificationsPage() {
  return (
    <div className="page-shell">
      <Header title="Notifications" />
      <main className="page-content">
        <EmptyState
          icon={<Bell size={32} strokeWidth={1.6} />}
          title="No notifications."
          description="Encouragement from friends will appear here."
        />
      </main>
      <NavigationBar />
    </div>
  );
}
