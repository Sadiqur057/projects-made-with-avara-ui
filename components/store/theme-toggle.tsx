"use client";

import { Moon, Sun } from "lucide-react";
import { useHydrated } from "@/lib/store";

const KEY = "aurelle:theme";

/** Light/dark switch. The initial class is set by an inline script in the layout. */
export function ThemeToggle() {
  const hydrated = useHydrated();

  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(KEY, next ? "dark" : "light");
    } catch {
      // Storage unavailable: the choice just lasts for this visit.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <Sun className="size-3.5 dark:hidden" aria-hidden="true" />
      <Moon className="hidden size-3.5 dark:block" aria-hidden="true" />
      <span className="dark:hidden">Light</span>
      <span className="hidden dark:inline">Dark</span>
      {!hydrated && <span className="sr-only">loading</span>}
    </button>
  );
}
