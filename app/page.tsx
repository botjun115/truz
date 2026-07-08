import { CreateFlow } from "@/components/Create/CreateFlow";
import { HomeFeed } from "@/components/Feed/HomeFeed";
import { NavigationBar } from "@/components/Navigation/NavigationBar";

export default function HomePage() {
  return (
    <div className="page-shell">
      <HomeFeed />
      <NavigationBar />
      <CreateFlow />
    </div>
  );
}