"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import type { Theme } from "@/lib/theme";
import { Button } from "./ui/button";

const themeLabels: Record<Theme, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

const themeIcons: Record<Theme, string> = {
  light: "☀",
  dark: "☾",
  system: "◐",
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-9 gap-2"
        disabled
        aria-label="Change theme"
      >
        <span aria-hidden="true">◐</span>
        <span className="hidden sm:inline">Theme</span>
      </Button>
    );
  }

  const currentTheme: Theme =
    theme === "light" || theme === "dark" || theme === "system"
      ? theme
      : "system";

  const nextTheme: Theme =
    currentTheme === "light"
      ? "dark"
      : currentTheme === "dark"
        ? "system"
        : "light";

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="h-9 gap-2"
      onClick={() => setTheme(nextTheme)}
      aria-label={`Switch theme. Current theme: ${themeLabels[currentTheme]}`}
      title={`Current theme: ${themeLabels[currentTheme]}`}
    >
      <span aria-hidden="true">{themeIcons[currentTheme]}</span>
      <span className="hidden sm:inline">
        {themeLabels[currentTheme]}
      </span>
    </Button>
  );
}
