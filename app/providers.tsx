"use client";

import { AuthProvider } from "@/context/AuthContext";
import { CreateQuestProvider } from "@/context/CreateQuestContext";
import { FeedProvider } from "@/context/FeedContext";
import { ProfileProvider } from "@/context/ProfileContext";
import { QuestProvider } from "@/context/QuestContext";
import { ThemeProvider } from "@/context/ThemeContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark">
      <AuthProvider>
        <ProfileProvider>
          <QuestProvider>
            <FeedProvider>
              <CreateQuestProvider>{children}</CreateQuestProvider>
            </FeedProvider>
          </QuestProvider>
        </ProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}