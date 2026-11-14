"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Clock, Flame, PenSquare, RotateCcw, Search, SearchX, TrendingUp, X } from "lucide-react";
import { toast } from "@/components/custom/blocks/sonner-store";
import { CATEGORIES } from "@/lib/forum/seed";
import {
  categoryThreadCount,
  filterThreads,
  formatCount,
  sortThreads,
  topContributors,
} from "@/lib/forum/selectors";
import { resetDemo, useForum } from "@/lib/forum/store";
import type { SortKey } from "@/lib/forum/types";
import { cn } from "@/lib/utils";
import { ThreadCard, ThreadCardSkeleton } from "./thread-card";
import { UserAvatar } from "./user-avatar";

const SORTS: { key: SortKey; label: string; icon: typeof Flame; hint: string }[] = [
  { key: "hot", label: "Hot", icon: Flame, hint: "Upvotes weighted by freshness" },
  { key: "new", label: "New", icon: Clock, hint: "Most recent first" },
  { key: "top", label: "Top", icon: TrendingUp, hint: "Most upvotes of all time" },
];

function isSort(v: string | null): v is SortKey {
  return v === "hot" || v === "new" || v === "top";
}

export function ForumView() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { state, ready } = useForum();

  const category = params.get("category") ?? "all";
  const sortParam = params.get("sort");
  const sort: SortKey = isSort(sortParam) ? sortParam : "hot";
  const q = params.get("q") ?? "";

  function update(patch: Record<string, string | null>) {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (!v || v === "all" || (k === "sort" && v === "hot")) next.delete(k);
      else next.set(k, v);
    }
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const [draft, setDraft] = useState(q);
  const [lastQ, setLastQ] = useState(q);
  // When the query changes from outside (navbar search, hero search) keep the box in step.
  if (q !== lastQ) {
    setLastQ(q);
    setDraft(q);
  }

  const filtered = filterThreads(state, { category, q });
  let threads = sortThreads(filtered, sort);
  if (sort === "hot" && !q) {
    threads = [...threads.filter((t) => t.pinned), ...threads.filter((t) => !t.pinned)];
  }
  const activeCategory = CATEGORIES.find((c) => c.id === category);
  const filtersActive = category !== "all" || q !== "";

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Forum home</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {activeCategory ? (
              <>
                <span aria-hidden="true">{activeCategory.emoji}</span> {activeCategory.name}
              </>
            ) : (
              "All discussions"
            )}
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            {activeCategory?.description ?? "Browse everything the community is talking about, or start your own thread."}
          </p>
        </div>
        <Link
          href={activeCategory ? `/new?category=${activeCategory.id}` : "/new"}
          className="inline-flex h-11 items-center gap-2 self-start rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:self-auto"
        >
          <PenSquare className="size-4" aria-hidden="true" /> New post
        </Link>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <section aria-label="Discussions" className="min-w-0">
          {/* Search + sort */}
          <div className="flex flex-col gap-4">
            <form
              role="search"
              className="relative"
              onSubmit={(e) => {
                e.preventDefault();
                update({ q: draft.trim() });
              }}
            >
              <label htmlFor="forum-search" className="sr-only">
                Search discussions
              </label>
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                id="forum-search"
                type="search"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Search by title, tag or author…"
                autoComplete="off"
                className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-24 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
              />
              {draft && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => {
                    setDraft("");
                    update({ q: null });
                  }}
                  className="absolute right-[4.75rem] top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 h-8 -translate-y-1/2 rounded-lg bg-primary px-3.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
              >
                Search
              </button>
            </form>

            {/* Category chips */}
            <nav aria-label="Filter by category" className="flex flex-wrap gap-2">
              {[{ id: "all", name: "All", emoji: "🌐" }, ...CATEGORIES].map((c) => {
                const active = category === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => update({ category: c.id })}
                    aria-pressed={active}
                    data-testid={`filter-${c.id}`}
                    className={cn(
                      "inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-colors",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground hover:border-primary/50 hover:text-primary",
                    )}
                  >
                    <span aria-hidden="true">{c.emoji}</span>
                    {c.name}
                  </button>
                );
              })}
            </nav>

            {/* Sort */}
            <div className="flex items-center justify-between gap-3">
              <div
                role="radiogroup"
                aria-label="Sort discussions"
                className="inline-flex rounded-xl border border-border bg-muted/60 p-1"
              >
                {SORTS.map(({ key, label, icon: Icon, hint }) => {
                  const active = sort === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      title={hint}
                      data-testid={`sort-${key}`}
                      onClick={() => update({ sort: key })}
                      className={cn(
                        "inline-flex h-8 items-center gap-1.5 rounded-lg px-3.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-card text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <Icon className="size-3.5" aria-hidden="true" />
                      {label}
                    </button>
                  );
                })}
              </div>
              <p className="text-sm text-muted-foreground" aria-live="polite" data-testid="result-count">
                {threads.length} {threads.length === 1 ? "discussion" : "discussions"}
                {q && (
                  <>
                    {" "}
                    for <span className="font-medium text-foreground">“{q}”</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* List */}
          <div className="mt-5 flex flex-col gap-3" data-testid="thread-list">
            {!ready ? (
              <>
                <ThreadCardSkeleton />
                <ThreadCardSkeleton />
                <ThreadCardSkeleton />
              </>
            ) : threads.length === 0 ? (
              <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
                <SearchX className="size-10 text-muted-foreground" aria-hidden="true" />
                <h2 className="mt-4 text-lg font-semibold">No discussions found</h2>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Nothing matches your filters. Try different words, or be the first to start this conversation.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  {filtersActive && (
                    <button
                      type="button"
                      onClick={() => {
                        setDraft("");
                        router.replace(pathname, { scroll: false });
                      }}
                      className="h-10 rounded-full border border-border px-5 text-sm font-medium hover:bg-muted"
                    >
                      Clear filters
                    </button>
                  )}
                  <Link
                    href="/new"
                    className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:opacity-90"
                  >
                    Start a discussion
                  </Link>
                </div>
              </div>
            ) : (
              threads.map((t) => <ThreadCard key={t.id} thread={t} />)
            )}
          </div>
        </section>

        {/* Sidebar */}
        <aside className="flex flex-col gap-4 self-start lg:sticky lg:top-6">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold">Categories</h2>
            <ul className="mt-3 flex flex-col gap-1">
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => update({ category: category === c.id ? "all" : c.id })}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm transition-colors hover:bg-muted",
                      category === c.id && "bg-accent font-medium text-accent-foreground",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span aria-hidden="true">{c.emoji}</span>
                      {c.name}
                    </span>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {formatCount(categoryThreadCount(state, c.id))}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold">Top contributors</h2>
            <ul className="mt-3 flex flex-col gap-3">
              {topContributors(state, 3).map(({ user, stats }) => (
                <li key={user.username}>
                  <Link href={`/u/${user.username}`} className="flex items-center gap-3 rounded-lg hover:text-primary">
                    <UserAvatar username={user.username} name={user.name} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{user.name}</span>
                      <span className="block text-xs text-muted-foreground">{formatCount(stats.reputation)} rep</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-muted/50 p-5 text-sm">
            <h2 className="font-semibold">Demo data</h2>
            <p className="mt-1 text-muted-foreground">
              Posts, replies and upvotes are stored in this browser&apos;s localStorage.
            </p>
            <button
              type="button"
              onClick={() => {
                resetDemo();
                toast.info("Demo data reset", { description: "Back to the original seeded discussions." });
              }}
              className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-medium hover:bg-muted"
            >
              <RotateCcw className="size-3.5" aria-hidden="true" /> Reset demo data
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
