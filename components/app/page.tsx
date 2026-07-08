import Link from "next/link";
import { Mountain } from "lucide-react";
import { FeedList } from "@/components/Feed/FeedList";
import { EmptyState } from "@/components/Feedback/EmptyState";
import { Header } from "@/components/Header/Header";
import { NavigationBar } from "@/components/Navigation/NavigationBar";
import { ROUTES } from "@/constants/routes";

export default function HomePage() {
  return (
    <div className="page-shell">
      <Header brand />
      <main className="page-content">
        <FeedList
          items={[]}
          emptyState={
            <EmptyState
              icon={<Mountain size={36} strokeWidth={1.6} />}
              title="No quests yet."
              description="Start your first quest."
              action={
                <Link href={ROUTES.camera} className="btn-primary">
                  Start Quest
                </Link>
              }
            />
          }
        />
      </main>
      <NavigationBar />
    </div>
  );
}
