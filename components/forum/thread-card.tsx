"use client";

import Link from "next/link";
import { Eye, MessageSquare, Pin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getCategory, getUser, replyCount } from "@/lib/forum/selectors";
import { useForum } from "@/lib/forum/store";
import type { Thread } from "@/lib/forum/types";
import { cn } from "@/lib/utils";
import { TimeAgo } from "./time-ago";
import { UserAvatar } from "./user-avatar";
import { VoteButton } from "./vote-button";

export function ThreadCard({ thread, className }: { thread: Thread; className?: string }) {
  const { state } = useForum();
  const category = getCategory(thread.category);
  const author = getUser(state, thread.author);
  const replies = replyCount(state, thread.id);

  return (
    <article
      data-testid="thread-card"
      className={cn(
        "group relative flex gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40 sm:p-5",
        className,
      )}
    >
      <VoteButton kind="t" id={thread.id} votes={thread.votes} label={`“${thread.title}”`} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {thread.pinned && (
            <span className="inline-flex items-center gap-1 font-medium text-primary">
              <Pin className="size-3" aria-hidden="true" /> Pinned
            </span>
          )}
          {category && (
            <Badge variant="secondary" className="gap-1">
              <span aria-hidden="true">{category.emoji}</span>
              {category.name}
            </Badge>
          )}
          <span>
            Posted <TimeAgo iso={thread.createdAt} />
          </span>
        </div>

        <h3 className="mt-2 text-base font-semibold leading-snug tracking-tight sm:text-lg">
          {/* The stretched link makes the whole card clickable while the vote button stays on top. */}
          <Link
            href={`/thread/${thread.id}`}
            className="outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-3 focus-visible:after:ring-ring/50"
          >
            {thread.title}
          </Link>
        </h3>

        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
          {thread.body.replace(/\n+/g, " ")}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <span className="relative z-10 inline-flex items-center gap-2">
            <UserAvatar username={thread.author} name={author?.name} size="xs" />
            <Link href={`/u/${thread.author}`} className="font-medium text-foreground hover:text-primary hover:underline">
              {author?.name ?? thread.author}
            </Link>
          </span>
          <span className="inline-flex items-center gap-1" data-testid="thread-replies">
            <MessageSquare className="size-3.5" aria-hidden="true" />
            {replies} {replies === 1 ? "reply" : "replies"}
          </span>
          <span className="inline-flex items-center gap-1">
            <Eye className="size-3.5" aria-hidden="true" />
            {thread.views.toLocaleString("en-US")} views
          </span>
          {thread.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="hidden text-muted-foreground/80 sm:inline">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export function ThreadCardSkeleton() {
  return (
    <div className="flex gap-4 rounded-2xl border border-border bg-card p-5" aria-hidden="true">
      <div className="h-16 w-12 animate-pulse rounded-xl bg-muted" />
      <div className="flex-1 space-y-3">
        <div className="h-3 w-40 animate-pulse rounded bg-muted" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-full animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
