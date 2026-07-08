"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="grid grid-cols-2 gap-2.5">
      <button
        type="button"
        onClick={() => setTheme("light")}
        aria-pressed={theme === "light"}
        className={`flex h-12 items-center justify-center gap-2 rounded-control border text-sm font-semibold ${
          theme === "light" ? "border-ink" : "border-line"
        } bg-white text-[#111111]`}
      >
        <Sun size={16} /> Light
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        aria-pressed={theme === "dark"}
        className={`flex h-12 items-center justify-center gap-2 rounded-control border text-sm font-semibold ${
          theme === "dark" ? "border-ink" : "border-line"
        } bg-[#111111] text-[#f4f4f4]`}
      >
        <Moon size={16} /> Shadow
      </button>
    </div>
  );
}
