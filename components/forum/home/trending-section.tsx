"use client";

import Link from "next/link";
import { ArrowRight, Flame, PenSquare } from "lucide-react";
import { trendingThreads } from "@/lib/forum/selectors";
import { useForum } from "@/lib/forum/store";
import { ThreadCard } from "../thread-card";
import { SectionHeader } from "./section-header";

const TRENDING_TAGS = ["design-systems", "react", "accessibility", "career", "tokens", "feedback", "nextjs", "research"];

export function TrendingSection() {
  const { state } = useForum();
  const threads = trendingThreads(state, 5);

  return (
    <section aria-labelledby="trending-heading" className="border-y border-border bg-muted/40">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div id="trending-heading">
          <SectionHeader
            eyebrow="Trending discussion"
            title="What the community is talking about"
            description="Ranked by upvotes and freshness. Upvote what helps, jump in with a reply."
            action={
              <Link
                href="/forum"
                className="inline-flex h-10 items-center gap-2 self-start rounded-full border border-border bg-card px-4 text-sm font-medium transition-colors hover:border-primary/50 hover:text-primary sm:self-auto"
              >
                Browse all discussions <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            }
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <ol className="flex flex-col gap-3" data-testid="trending-list">
            {threads.map((t, i) => (
              <li key={t.id} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-2 -top-2 z-10 grid size-6 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground shadow"
                >
                  {i + 1}
                </span>
                <ThreadCard thread={t} />
              </li>
            ))}
          </ol>

          <aside className="flex flex-col gap-4 self-start">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Flame className="size-4 text-primary" aria-hidden="true" /> Trending tags
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {TRENDING_TAGS.map((tag) => (
                  <Link
                    key={tag}
                    href={`/forum?q=${encodeURIComponent(tag)}`}
                    className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
              <h3 className="text-base font-semibold">Have something to ask or share?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Start a thread in under a minute. Your post is saved right here in your browser.
              </p>
              <Link
                href="/new"
                className="mt-4 inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <PenSquare className="size-4" aria-hidden="true" /> New post
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
