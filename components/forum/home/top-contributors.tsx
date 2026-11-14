"use client";

import Link from "next/link";
import { Award, MessageSquare, ThumbsUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCount, topContributors } from "@/lib/forum/selectors";
import { useForum } from "@/lib/forum/store";
import { cn } from "@/lib/utils";
import { UserAvatar } from "../user-avatar";
import { SectionHeader } from "./section-header";

export function TopContributors() {
  const { state } = useForum();
  const people = topContributors(state, 5);

  return (
    <section aria-labelledby="contributors-heading" className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <div id="contributors-heading">
        <SectionHeader
          eyebrow="Top contributors"
          title="The people who make this place helpful"
          description="Reputation grows with every thoughtful post and every upvote earned from the community."
        />
      </div>

      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {people.map(({ user, stats }, i) => (
          <li key={user.username} className={cn(i === 0 && "sm:col-span-2 lg:col-span-1")}>
            <Link
              href={`/u/${user.username}`}
              data-testid={`contributor-${user.username}`}
              className={cn(
                "group relative flex h-full flex-col items-center rounded-2xl border bg-card p-5 text-center outline-none transition-all hover:-translate-y-0.5 hover:border-primary/50 focus-visible:ring-3 focus-visible:ring-ring/50",
                i === 0 ? "border-primary/40 bg-primary/5" : "border-border",
              )}
            >
              <span
                className={cn(
                  "absolute left-3 top-3 grid size-6 place-items-center rounded-full text-xs font-bold",
                  i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {i + 1}
              </span>
              {i === 0 && <Award className="absolute right-3 top-3 size-5 text-primary" aria-label="Top contributor" />}
              <UserAvatar username={user.username} name={user.name} size="lg" />
              <p className="mt-3 font-semibold leading-tight group-hover:text-primary">{user.name}</p>
              <p className="text-xs text-muted-foreground">@{user.username}</p>
              <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{user.headline}</p>
              <p className="mt-3 text-2xl font-semibold tabular-nums tracking-tight">
                {formatCount(stats.reputation)}
                <span className="ml-1 text-xs font-medium text-muted-foreground">rep</span>
              </p>
              <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <MessageSquare className="size-3.5" aria-hidden="true" />
                  {stats.threads + stats.replies}
                </span>
                <span className="inline-flex items-center gap-1">
                  <ThumbsUp className="size-3.5" aria-hidden="true" />
                  {formatCount(stats.upvotesReceived)}
                </span>
              </div>
              {user.badges[0] && (
                <Badge variant="secondary" className="mt-3">
                  {user.badges[0]}
                </Badge>
              )}
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
