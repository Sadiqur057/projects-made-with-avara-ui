"use client";

import Link from "next/link";
import { useState } from "react";
import { Calendar, FileText, MapPin, MessageSquare, SearchX, ThumbsUp, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { monthYear } from "@/lib/forum/format";
import { formatCount, getUser, userStats } from "@/lib/forum/selectors";
import { useForum } from "@/lib/forum/store";
import { CURRENT_USER } from "@/lib/forum/types";
import { cn } from "@/lib/utils";
import { ThreadCard } from "./thread-card";
import { TimeAgo } from "./time-ago";
import { UserAvatar } from "./user-avatar";

type Tab = "posts" | "replies" | "upvoted";

export function ProfileView({ username }: { username: string }) {
  const { state, ready } = useForum();
  const [tab, setTab] = useState<Tab>("posts");
  const user = getUser(state, username);

  if (!ready) {
    return (
      <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8" aria-busy="true" aria-label="Loading profile">
        <div className="h-48 animate-pulse rounded-3xl bg-muted" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col items-center px-5 py-24 text-center">
        <SearchX className="size-12 text-muted-foreground" aria-hidden="true" />
        <h1 className="mt-4 text-2xl font-semibold">No member called @{username}</h1>
        <p className="mt-2 text-muted-foreground">Check the spelling, or find people from the top contributors list.</p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Back home
        </Link>
      </div>
    );
  }

  const isYou = user.username === CURRENT_USER;
  const stats = userStats(state, user.username);
  const threads = state.threads
    .filter((t) => t.author === user.username)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  const replies = state.replies
    .filter((r) => r.author === user.username)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  const upvoted = isYou
    ? state.threads.filter((t) => state.voted[`t:${t.id}`])
    : [];

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "posts", label: "Posts", count: threads.length },
    { key: "replies", label: "Replies", count: replies.length },
    ...(isYou ? [{ key: "upvoted" as const, label: "Upvoted", count: upvoted.length }] : []),
  ];

  const statCards = [
    { label: "Reputation", value: formatCount(stats.reputation), icon: Trophy },
    { label: "Posts", value: String(stats.threads), icon: FileText },
    { label: "Replies", value: String(stats.replies), icon: MessageSquare },
    { label: "Upvotes earned", value: formatCount(stats.upvotesReceived), icon: ThumbsUp },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
      {/* Header card */}
      <section aria-label="Profile" className="overflow-hidden rounded-3xl border border-border bg-card">
        <div
          aria-hidden="true"
          className="h-28 bg-[radial-gradient(circle_at_20%_20%,color-mix(in_oklab,var(--primary)_35%,transparent),transparent_60%),radial-gradient(circle_at_80%_0%,color-mix(in_oklab,var(--primary)_20%,transparent),transparent_55%)] bg-muted sm:h-36"
        />
        <div className="px-5 pb-6 sm:px-8">
          <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
            <UserAvatar username={user.username} name={user.name} size="xl" className="size-24 ring-4 ring-card sm:size-28" />
            {isYou ? (
              <Link
                href="/new"
                className="inline-flex h-10 items-center self-start rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:opacity-90 sm:self-auto"
              >
                Write a new post
              </Link>
            ) : (
              <Link
                href="/forum"
                className="inline-flex h-10 items-center self-start rounded-full border border-border px-5 text-sm font-medium hover:bg-muted sm:self-auto"
              >
                Browse discussions
              </Link>
            )}
          </div>

          <div className="mt-4">
            <h1 className="flex flex-wrap items-center gap-2 text-2xl font-semibold tracking-tight sm:text-3xl" data-testid="profile-name">
              {user.name}
              {isYou && <Badge variant="secondary">You</Badge>}
            </h1>
            <p className="text-sm text-muted-foreground">
              @{user.username} · {user.headline}
            </p>
            <p className="mt-4 max-w-2xl text-pretty leading-relaxed">{user.bio}</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4" aria-hidden="true" /> {user.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-4" aria-hidden="true" /> Joined {monthYear(user.joined)}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {user.badges.map((b) => (
                <Badge key={b} variant="secondary">
                  {b}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-4">
            <dt className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Icon className="size-4 text-primary" aria-hidden="true" /> {label}
            </dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums tracking-tight" data-testid={`stat-${label.split(" ")[0].toLowerCase()}`}>
              {value}
            </dd>
          </div>
        ))}
      </dl>

      {/* Activity */}
      <section aria-label="Activity" className="mt-8">
        <div role="tablist" aria-label="Profile activity" className="flex gap-1 border-b border-border">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              id={`tab-${t.key}`}
              aria-selected={tab === t.key}
              aria-controls={`panel-${t.key}`}
              data-testid={`tab-${t.key}`}
              onClick={() => setTab(t.key)}
              className={cn(
                "-mb-px inline-flex h-11 items-center gap-2 border-b-2 px-4 text-sm font-medium transition-colors",
                tab === t.key
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs tabular-nums">{t.count}</span>
            </button>
          ))}
        </div>

        <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="mt-5 flex flex-col gap-3">
          {tab === "posts" &&
            (threads.length === 0 ? (
              <Empty
                title="No posts yet"
                text={isYou ? "Start your first discussion and it will show up here." : "This member hasn't posted yet."}
                action={isYou ? { href: "/new", label: "Create a post" } : undefined}
              />
            ) : (
              threads.map((t) => <ThreadCard key={t.id} thread={t} />)
            ))}

          {tab === "replies" &&
            (replies.length === 0 ? (
              <Empty title="No replies yet" text="Replies written by this member appear here." />
            ) : (
              replies.map((r) => {
                const thread = state.threads.find((t) => t.id === r.threadId);
                return (
                  <article key={r.id} className="rounded-2xl border border-border bg-card p-4 sm:p-5" data-testid="profile-reply">
                    <p className="text-xs text-muted-foreground">
                      Replied on{" "}
                      <Link href={`/thread/${r.threadId}#${r.id}`} className="font-medium text-foreground hover:text-primary hover:underline">
                        {thread?.title ?? "a discussion"}
                      </Link>{" "}
                      · <TimeAgo iso={r.createdAt} />
                    </p>
                    <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed">{r.body}</p>
                    <p className="mt-2 text-xs text-muted-foreground">▲ {r.votes}</p>
                  </article>
                );
              })
            ))}

          {tab === "upvoted" &&
            (upvoted.length === 0 ? (
              <Empty title="Nothing upvoted yet" text="Upvote posts you find useful and they'll be collected here." action={{ href: "/forum", label: "Browse discussions" }} />
            ) : (
              upvoted.map((t) => <ThreadCard key={t.id} thread={t} />)
            ))}
        </div>
      </section>
    </div>
  );
}

function Empty({ title, text, action }: { title: string; text: string; action?: { href: string; label: string } }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
      <MessageSquare className="size-9 text-muted-foreground" aria-hidden="true" />
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{text}</p>
      {action && (
        <Link
          href={action.href}
          className="mt-5 inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
