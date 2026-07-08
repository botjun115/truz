export type ThemeMode = "light" | "dark";

export interface UserSettings {
  theme: ThemeMode;
  displayName: string;
  avatarUrl: string | null;
  accentColor: string;
}
