"use client";

import { Moon, Sun } from "lucide-react";
import { useCallback, useSyncExternalStore } from "react";

const KEY = "forumly:theme";

function subscribe(cb: () => void) {
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => obs.disconnect();
}

const getDark = () => document.documentElement.classList.contains("dark");

/** Dark-mode switch. The initial class is set by a script in the layout to avoid a flash. */
export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getDark, () => false);

  const toggle = useCallback(() => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      window.localStorage.setItem(KEY, next ? "dark" : "light");
    } catch {
      // ignore
    }
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={dark}
      className="inline-flex p-2 rounded-full text-foreground hover:bg-muted transition-colors"
    >
      {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}

export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem("${KEY}");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;
