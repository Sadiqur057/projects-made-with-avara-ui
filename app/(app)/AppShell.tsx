"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Command, LayoutDashboard, LogOut, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "@/lib/session";

const LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/assistant", label: "Assistant", icon: Sparkles },
];

/** Top bar and sign-in guard for the signed-in pages. */
export function AppShell({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();
  // Set while signing out so the guard below does not redirect to /login first.
  const signingOut = useRef(false);

  useEffect(() => {
    if (session === null && !signingOut.current) router.replace("/login");
  }, [session, router]);

  if (!session) {
    return (
      <div
        className="flex min-h-screen flex-1 items-center justify-center text-sm text-muted-foreground"
        role="status"
      >
        Loading your workspace…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-4 sm:px-6">
          <Link href="/" className="mr-2 flex items-center gap-2 font-bold tracking-tight">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Command className="size-4" />
            </span>
            <span className="hidden sm:inline">Notewise</span>
          </Link>

          <nav aria-label="App" className="flex items-center gap-1">
            {LINKS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  aria-label={label}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground md:inline" data-testid="session-name">
              {session.name}
            </span>
            <button
              type="button"
              onClick={() => {
                signingOut.current = true;
                router.push("/");
                signOut();
              }}
              aria-label="Sign out"
              className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 sm:px-3.5 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
