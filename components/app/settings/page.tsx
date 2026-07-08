import type { Metadata } from "next";
import { ThemeToggle } from "@/components/Buttons/ThemeToggle";
import { Header } from "@/components/Header/Header";
import { NavigationBar } from "@/components/Navigation/NavigationBar";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="page-shell">
      <Header title="Settings" backHref="/profile" />
      <main className="page-content flex flex-col gap-6">
        <section className="flex flex-col gap-3">
          <h2 className="font-display text-sm font-semibold">Theme</h2>
          <ThemeToggle />
        </section>
      </main>
      <NavigationBar />
    </div>
  );
}
