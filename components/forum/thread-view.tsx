"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { CornerDownRight, Eye, MessageSquare, SearchX, Send, X } from "lucide-react";
import { BreadcrumbBlock } from "@/components/custom/blocks/BreadcrumbBlock";
import { toast } from "@/components/custom/blocks/sonner-store";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { getCategory, getUser } from "@/lib/forum/selectors";
import { addReply, incrementViews, useForum } from "@/lib/forum/store";
import { CURRENT_USER, type Reply } from "@/lib/forum/types";
import { cn } from "@/lib/utils";
import { TimeAgo } from "./time-ago";
import { UserAvatar } from "./user-avatar";
import { VoteButton } from "./vote-button";

type ReplySort = "best" | "new" | "old";

const REPLY_SORTS: { key: ReplySort; label: string }[] = [
  { key: "best", label: "Best" },
  { key: "new", label: "Newest" },
  { key: "old", label: "Oldest" },
];

function Paragraphs({ text, className }: { text: string; className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      {text.split(/\n{2,}/).map((block, i) => (
        <p key={i} className="whitespace-pre-line text-pretty leading-relaxed">
          {block}
        </p>
      ))}
    </div>
  );
}

export function ThreadView({ id }: { id: string }) {
  const { state, ready } = useForum();
  const thread = state.threads.find((t) => t.id === id);

  // Count a view once per browser tab session, not once per render.
  useEffect(() => {
    if (!ready || !thread) return;
    const key = `forumly:viewed:${id}`;
    try {
      if (window.sessionStorage.getItem(key)) return;
      window.sessionStorage.setItem(key, "1");
    } catch {
      return;
    }
    incrementViews(id);
  }, [ready, thread, id]);

  const [sort, setSort] = useState<ReplySort>("best");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [flashId, setFlashId] = useState<string | null>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);

  const replies = useMemo(() => {
    const list = state.replies.filter((r) => r.threadId === id);
    switch (sort) {
      case "new":
        return [...list].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
      case "old":
        return [...list].sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
      default:
        return [...list].sort((a, b) => b.votes - a.votes || Date.parse(a.createdAt) - Date.parse(b.createdAt));
    }
  }, [state.replies, id, sort]);

  if (!ready) {
    return (
      <div className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8" aria-busy="true" aria-label="Loading thread">
        <div className="h-4 w-48 animate-pulse rounded bg-muted" />
        <div className="mt-6 h-9 w-3/4 animate-pulse rounded bg-muted" />
        <div className="mt-6 h-40 animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col items-center px-5 py-24 text-center">
        <SearchX className="size-12 text-muted-foreground" aria-hidden="true" />
        <h1 className="mt-4 text-2xl font-semibold">We couldn&apos;t find that thread</h1>
        <p className="mt-2 text-muted-foreground">
          It may have been removed, or the link is wrong. If you reset the demo data, posts you created are gone.
        </p>
        <Link
          href="/forum"
          className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Back to the forum
        </Link>
      </div>
    );
  }

  const category = getCategory(thread.category);
  const author = getUser(state, thread.author);
  const participants = Array.from(new Set([thread.author, ...replies.map((r) => r.author)]));
  const related = state.threads
    .filter((t) => t.category === thread.category && t.id !== thread.id)
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 3);

  function startReply(username: string) {
    setReplyTo(username);
    setError(null);
    composerRef.current?.focus();
    composerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = body.trim();
    if (text.length < 2) {
      setError("Write at least a couple of characters before posting your reply.");
      composerRef.current?.focus();
      return;
    }
    const replyId = addReply({ threadId: id, body: text, replyTo: replyTo ?? undefined });
    setBody("");
    setReplyTo(null);
    setError(null);
    setFlashId(replyId);
    setSort("new");
    toast.success("Reply posted", { description: "Your reply is live in this thread." });
    window.setTimeout(() => {
      document.getElementById(replyId)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
    window.setTimeout(() => setFlashId(null), 2600);
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
      <BreadcrumbBlock
        linkComponent={Link}
        maxItems={3}
        items={[
          { label: "Forum", href: "/forum" },
          { label: category?.name ?? "Category", href: `/forum?category=${thread.category}` },
          { label: thread.title },
        ]}
      />

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0">
          {/* The original post */}
          <article className="rounded-2xl border border-border bg-card p-5 sm:p-7" data-testid="thread-article">
            <div className="flex gap-4 sm:gap-5">
              <VoteButton kind="t" id={thread.id} votes={thread.votes} label="this thread" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  {category && (
                    <Link href={`/forum?category=${category.id}`}>
                      <Badge variant="secondary" className="gap-1 hover:bg-accent">
                        <span aria-hidden="true">{category.emoji}</span>
                        {category.name}
                      </Badge>
                    </Link>
                  )}
                  <span>
                    Posted <TimeAgo iso={thread.createdAt} />
                  </span>
                </div>
                <h1 className="mt-3 text-balance text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
                  {thread.title}
                </h1>

                <div className="mt-4 flex items-center gap-3">
                  <UserAvatar username={thread.author} name={author?.name} size="md" />
                  <div className="leading-tight">
                    <Link href={`/u/${thread.author}`} className="font-medium hover:text-primary hover:underline">
                      {author?.name ?? thread.author}
                    </Link>
                    <p className="text-xs text-muted-foreground">{author?.headline}</p>
                  </div>
                </div>

                <Paragraphs text={thread.body} className="mt-5 text-[15px]" />

                <div className="mt-6 flex flex-wrap items-center gap-2">
                  {thread.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/forum?q=${encodeURIComponent(tag)}`}
                      className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
                    >
                      #{tag}
                    </Link>
                  ))}
                  <span className="ml-auto inline-flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Eye className="size-3.5" aria-hidden="true" />
                      {thread.views.toLocaleString("en-US")}
                    </span>
                    <span className="inline-flex items-center gap-1" data-testid="reply-total">
                      <MessageSquare className="size-3.5" aria-hidden="true" />
                      {replies.length}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </article>

          {/* Replies */}
          <section aria-labelledby="replies-heading" className="mt-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="replies-heading" className="text-xl font-semibold tracking-tight">
                {replies.length} {replies.length === 1 ? "reply" : "replies"}
              </h2>
              {replies.length > 1 && (
                <div role="radiogroup" aria-label="Sort replies" className="inline-flex rounded-xl border border-border bg-muted/60 p-1">
                  {REPLY_SORTS.map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      role="radio"
                      aria-checked={sort === key}
                      onClick={() => setSort(key)}
                      data-testid={`reply-sort-${key}`}
                      className={cn(
                        "h-8 rounded-lg px-3 text-sm font-medium transition-colors",
                        sort === key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {replies.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center">
                <MessageSquare className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
                <p className="mt-3 font-medium">No replies yet</p>
                <p className="text-sm text-muted-foreground">Be the first to share your thoughts.</p>
              </div>
            ) : (
              <ol className="mt-5 flex flex-col gap-3" data-testid="reply-list">
                {replies.map((r) => (
                  <ReplyItem
                    key={r.id}
                    reply={r}
                    isOp={r.author === thread.author}
                    flash={flashId === r.id}
                    onReply={() => startReply(r.author)}
                  />
                ))}
              </ol>
            )}

            {/* Composer */}
            <form onSubmit={submit} noValidate className="mt-8 rounded-2xl border border-border bg-card p-4 sm:p-5" data-testid="reply-form">
              <div className="flex items-center gap-3">
                <UserAvatar username={CURRENT_USER} name="Demo User" size="sm" />
                <label htmlFor="reply-body" className="text-sm font-semibold">
                  Add your reply
                </label>
              </div>

              {replyTo && (
                <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                  <CornerDownRight className="size-3.5" aria-hidden="true" />
                  Replying to @{replyTo}
                  <button
                    type="button"
                    onClick={() => setReplyTo(null)}
                    aria-label="Cancel replying to this person"
                    className="grid size-4 place-items-center rounded-full hover:bg-background/60"
                  >
                    <X className="size-3" />
                  </button>
                </p>
              )}

              <Textarea
                id="reply-body"
                ref={composerRef}
                value={body}
                onChange={(e) => {
                  setBody(e.target.value);
                  if (error) setError(null);
                }}
                rows={4}
                maxLength={2000}
                placeholder="Share what you know. Be specific and kind."
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "reply-error" : "reply-hint"}
                className="mt-3 min-h-28 resize-y text-[15px]"
              />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p id={error ? "reply-error" : "reply-hint"} role={error ? "alert" : undefined} className={cn("text-xs", error ? "text-destructive" : "text-muted-foreground")}>
                  {error ?? `${body.length}/2000 · Replies are saved to your browser.`}
                </p>
                <button
                  type="submit"
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <Send className="size-4" aria-hidden="true" /> Post reply
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-4 self-start lg:sticky lg:top-6">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold">About the author</h2>
            <div className="mt-3 flex items-center gap-3">
              <UserAvatar username={thread.author} name={author?.name} size="lg" />
              <div className="min-w-0">
                <Link href={`/u/${thread.author}`} className="block truncate font-semibold hover:text-primary">
                  {author?.name ?? thread.author}
                </Link>
                <p className="text-xs text-muted-foreground">@{thread.author}</p>
              </div>
            </div>
            {author && <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{author.bio}</p>}
            <Link
              href={`/u/${thread.author}`}
              className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-lg border border-border text-sm font-medium hover:bg-muted"
            >
              View profile
            </Link>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold">In this conversation</h2>
            <div className="mt-3">
              <ul className="flex -space-x-2" aria-label="Participants">
                {participants.slice(0, 6).map((u) => (
                  <li key={u}>
                    <Link href={`/u/${u}`} title={getUser(state, u)?.name ?? u}>
                      <UserAvatar username={u} name={getUser(state, u)?.name} size="md" className="ring-2 ring-card" />
                    </Link>
                  </li>
                ))}
                {participants.length > 6 && (
                  <li className="grid h-10 w-10 place-items-center rounded-full bg-muted text-xs font-medium ring-2 ring-card">
                    +{participants.length - 6}
                  </li>
                )}
              </ul>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {participants.length} {participants.length === 1 ? "person" : "people"} taking part
            </p>
          </div>

          {related.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-sm font-semibold">More in {category?.name}</h2>
              <ul className="mt-3 flex flex-col gap-3">
                {related.map((t) => (
                  <li key={t.id}>
                    <Link href={`/thread/${t.id}`} className="group block">
                      <span className="line-clamp-2 text-sm font-medium group-hover:text-primary">{t.title}</span>
                      <span className="text-xs text-muted-foreground">▲ {t.votes}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function ReplyItem({
  reply,
  isOp,
  flash,
  onReply,
}: {
  reply: Reply;
  isOp: boolean;
  flash: boolean;
  onReply: () => void;
}) {
  const { state } = useForum();
  const author = getUser(state, reply.author);
  const isYou = reply.author === CURRENT_USER;

  return (
    <li
      id={reply.id}
      data-testid="reply"
      className={cn(
        "scroll-mt-24 rounded-2xl border bg-card p-4 transition-colors duration-700 sm:p-5",
        flash ? "border-primary bg-primary/10" : "border-border",
      )}
    >
      <div className="flex items-start gap-3">
        <UserAvatar username={reply.author} name={author?.name} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            <Link href={`/u/${reply.author}`} className="font-semibold hover:text-primary hover:underline">
              {author?.name ?? reply.author}
            </Link>
            {isOp && <Badge variant="default">Author</Badge>}
            {isYou && <Badge variant="secondary">You</Badge>}
            <span className="text-xs text-muted-foreground">
              <TimeAgo iso={reply.createdAt} />
            </span>
          </div>

          {reply.replyTo && (
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
              <CornerDownRight className="size-3" aria-hidden="true" />
              replying to{" "}
              <Link href={`/u/${reply.replyTo}`} className="font-medium text-primary hover:underline">
                @{reply.replyTo}
              </Link>
            </p>
          )}

          <Paragraphs text={reply.body} className="mt-2 text-[15px]" />

          <div className="mt-3 flex items-center gap-2">
            <VoteButton kind="r" id={reply.id} votes={reply.votes} layout="pill" label={`reply by ${author?.name ?? reply.author}`} />
            <button
              type="button"
              onClick={onReply}
              className="inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <CornerDownRight className="size-3.5" aria-hidden="true" /> Reply
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

