"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Home, Search, User, type LucideIcon } from "lucide-react";
import { FloatingButton } from "@/components/Buttons/FloatingButton";
import { useCreateQuest } from "@/context/CreateQuestContext";
import { ROUTES } from "@/constants/routes";

interface NavTab {
  href: string;
  label: string;
  icon: LucideIcon;
}

const LEFT_TABS: readonly NavTab[] = [
  { href: ROUTES.home, label: "Home", icon: Home },
  { href: ROUTES.search, label: "Search", icon: Search },
];

const RIGHT_TABS: readonly NavTab[] = [
  { href: ROUTES.notifications, label: "Notifications", icon: Bell },
  { href: ROUTES.profile, label: "Profile", icon: User },
];

function NavLink({ tab, active }: { tab: NavTab; active: boolean }) {
  const Icon = tab.icon;
  return (
    <Link
      href={tab.href}
      aria-label={tab.label}
      aria-current={active ? "page" : undefined}
      className={`flex min-h-11 min-w-11 items-center justify-center transition-colors ${
        active ? "text-ink" : "text-faint hover:text-soft"
      }`}
    >
      <Icon size={20} strokeWidth={active ? 2.3 : 1.8} />
    </Link>
  );
}

export function NavigationBar() {
  const pathname = usePathname();
  const { openSheet } = useCreateQuest();

  return (
    <nav className="sticky bottom-0 z-20 border-t border-line bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-md items-center justify-around px-3 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-2">
        {LEFT_TABS.map((tab) => (
          <NavLink key={tab.href} tab={tab} active={pathname === tab.href} />
        ))}
        <FloatingButton onClick={openSheet} ariaLabel="Start quest" />
        {RIGHT_TABS.map((tab) => (
          <NavLink key={tab.href} tab={tab} active={pathname === tab.href} />
        ))}
      </div>
    </nav>
  );
}