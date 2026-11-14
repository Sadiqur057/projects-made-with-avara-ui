"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useMemo, useState, useSyncExternalStore } from "react";
import { ArrowLeft, Moon, PiggyBank, Plus, Sun, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { resetDemoData } from "@/lib/finance";
import { TransactionDialog } from "./TransactionDialog";
import { primaryBtnCls } from "./shared";

const NAV = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/transactions", label: "Transactions" },
  { href: "/dashboard/budgets", label: "Budgets" },
];

interface Actions {
  openAddTransaction: () => void;
}
const ActionsContext = createContext<Actions>({ openAddTransaction: () => {} });
export const useDashboardActions = () => useContext(ActionsContext);

/** Reads the `dark` class off <html> so the toggle always reflects the real state. */
function useIsDark() {
  return useSyncExternalStore(
    (cb) => {
      const observer = new MutationObserver(cb);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
      return () => observer.disconnect();
    },
    () => document.documentElement.classList.contains("dark"),
    () => false,
  );
}

function ThemeToggle() {
  const dark = useIsDark();
  return (
    <button
      type="button"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => document.documentElement.classList.toggle("dark")}
      className="grid size-10 place-items-center rounded-lg border border-border bg-card text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
    >
      {dark ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
    </button>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [txOpen, setTxOpen] = useState(false);
  const actions = useMemo<Actions>(() => ({ openAddTransaction: () => setTxOpen(true) }), []);

  return (
    <ActionsContext.Provider value={actions}>
      <div className="min-h-screen bg-muted/40">
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
          <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 sm:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold text-foreground" aria-label="Ledgerly home">
              <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
                <Wallet className="size-4" aria-hidden />
              </span>
              <span className="text-base">Ledgerly</span>
            </Link>

            <nav aria-label="Dashboard" className="order-3 grid w-full grid-cols-3 gap-1 rounded-xl bg-muted p-1 sm:order-none sm:flex sm:w-auto sm:grid-cols-none">
              {NAV.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-center text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
                      active ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="ml-auto flex items-center gap-2">
              <Link
                href="/"
                className="hidden h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-muted-foreground transition hover:text-foreground md:inline-flex"
              >
                <ArrowLeft className="size-4" aria-hidden /> Site
              </Link>
              <ThemeToggle />
              <button type="button" onClick={() => setTxOpen(true)} className={primaryBtnCls}>
                <Plus className="size-4" aria-hidden />
                <span className="hidden sm:inline">Add transaction</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">{children}</main>

        <footer className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-4 pb-8 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <p className="flex items-center gap-1.5">
            <PiggyBank className="size-3.5" aria-hidden /> Demo data, stored only in this browser.
          </p>
          <button
            type="button"
            onClick={resetDemoData}
            className="rounded underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
          >
            Reset demo data
          </button>
        </footer>

        <TransactionDialog open={txOpen} onOpenChange={setTxOpen} />
      </div>
    </ActionsContext.Provider>
  );
}
