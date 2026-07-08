"use client";

import { AuthProvider } from "@/context/AuthContext";
import { FeedProvider } from "@/context/FeedContext";
import { ProfileProvider } from "@/context/ProfileContext";
import { QuestProvider } from "@/context/QuestContext";
import { ThemeProvider } from "@/context/ThemeContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProfileProvider>
          <QuestProvider>
            <FeedProvider>{children}</FeedProvider>
          </QuestProvider>
        </ProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
