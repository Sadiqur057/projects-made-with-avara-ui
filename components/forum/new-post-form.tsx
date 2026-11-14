"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Lightbulb, Send } from "lucide-react";
import { toast } from "@/components/custom/blocks/sonner-store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES } from "@/lib/forum/seed";
import { createThread } from "@/lib/forum/store";
import type { CategoryId } from "@/lib/forum/types";
import { cn } from "@/lib/utils";

const TITLE_MIN = 8;
const TITLE_MAX = 120;
const BODY_MIN = 20;
const BODY_MAX = 5000;
const MAX_TAGS = 5;

interface Errors {
  title?: string;
  body?: string;
  category?: string;
}

function parseTags(raw: string) {
  return Array.from(
    new Set(
      raw
        .split(/[,\s]+/)
        .map((t) => t.replace(/^#/, "").toLowerCase().replace(/[^a-z0-9-]/g, ""))
        .filter(Boolean),
    ),
  ).slice(0, MAX_TAGS);
}

const TIPS = [
  "Use a specific, searchable title.",
  "Say what you've already tried.",
  "Share code, links or context where it helps.",
  "Add a few tags so the right people find it.",
];

export function NewPostForm() {
  const router = useRouter();
  const params = useSearchParams();
  const initial = params.get("category");
  const [category, setCategory] = useState<CategoryId | "">(
    CATEGORIES.some((c) => c.id === initial) ? (initial as CategoryId) : "",
  );
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const tagList = parseTags(tags);

  function validate(): Errors {
    const next: Errors = {};
    if (!category) next.category = "Choose a category so the right people see your post.";
    if (title.trim().length < TITLE_MIN) next.title = `Give your post a title of at least ${TITLE_MIN} characters.`;
    if (body.trim().length < BODY_MIN) next.body = `Add some detail: at least ${BODY_MIN} characters.`;
    return next;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      const first = next.category ? "category-group" : next.title ? "post-title" : "post-body";
      document.getElementById(first)?.focus();
      return;
    }
    setSubmitting(true);
    const id = createThread({ title, body, category: category as CategoryId, tags: tagList });
    toast.success("Post published", { description: "Your discussion is live. Say hello to the replies." });
    router.push(`/thread/${id}`);
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-12">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">New post</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Start a discussion</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Ask a question, share a project or kick off a debate. Your post is saved in this browser.
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-7 rounded-2xl border border-border bg-card p-5 sm:p-7" data-testid="new-post-form">
          {/* Category */}
          <fieldset>
            <legend className="text-sm font-semibold">
              Category <span aria-hidden="true" className="text-destructive">*</span>
            </legend>
            <div
              id="category-group"
              tabIndex={-1}
              role="radiogroup"
              aria-label="Category"
              aria-invalid={errors.category ? true : undefined}
              aria-describedby={errors.category ? "category-error" : undefined}
              className="mt-3 grid gap-2 outline-none sm:grid-cols-2 lg:grid-cols-3"
            >
              {CATEGORIES.map((c) => {
                const active = category === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    data-testid={`pick-${c.id}`}
                    onClick={() => {
                      setCategory(c.id);
                      setErrors((er) => ({ ...er, category: undefined }));
                    }}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl border px-3.5 py-3 text-left text-sm font-medium transition-colors",
                      active
                        ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary"
                        : "border-border hover:border-primary/50",
                    )}
                  >
                    <span className="text-lg" aria-hidden="true">{c.emoji}</span>
                    {c.name}
                  </button>
                );
              })}
            </div>
            {errors.category && (
              <p id="category-error" role="alert" className="mt-2 text-sm text-destructive">
                {errors.category}
              </p>
            )}
          </fieldset>

          {/* Title */}
          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="post-title" className="text-sm font-semibold">
                Title <span aria-hidden="true" className="text-destructive">*</span>
              </label>
              <span className="text-xs tabular-nums text-muted-foreground">
                {title.length}/{TITLE_MAX}
              </span>
            </div>
            <Input
              id="post-title"
              value={title}
              maxLength={TITLE_MAX}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((er) => ({ ...er, title: undefined }));
              }}
              placeholder="e.g. How do you structure design tokens across brands?"
              aria-invalid={errors.title ? true : undefined}
              aria-describedby={errors.title ? "title-error" : undefined}
              className="mt-2 h-11 text-base"
            />
            {errors.title && (
              <p id="title-error" role="alert" className="mt-2 text-sm text-destructive">
                {errors.title}
              </p>
            )}
          </div>

          {/* Body */}
          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="post-body" className="text-sm font-semibold">
                Details <span aria-hidden="true" className="text-destructive">*</span>
              </label>
              <span className="text-xs tabular-nums text-muted-foreground">
                {body.length}/{BODY_MAX}
              </span>
            </div>
            <Textarea
              id="post-body"
              value={body}
              maxLength={BODY_MAX}
              rows={9}
              onChange={(e) => {
                setBody(e.target.value);
                if (errors.body) setErrors((er) => ({ ...er, body: undefined }));
              }}
              placeholder="Describe the situation, what you've tried, and what kind of answer would help most."
              aria-invalid={errors.body ? true : undefined}
              aria-describedby={errors.body ? "body-error" : undefined}
              className="mt-2 min-h-48 resize-y text-[15px]"
            />
            {errors.body && (
              <p id="body-error" role="alert" className="mt-2 text-sm text-destructive">
                {errors.body}
              </p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="post-tags" className="text-sm font-semibold">
              Tags <span className="font-normal text-muted-foreground">(optional, up to {MAX_TAGS})</span>
            </label>
            <Input
              id="post-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="react, accessibility, feedback"
              aria-describedby="tags-hint"
              className="mt-2 h-10"
            />
            <div id="tags-hint" className="mt-2 flex min-h-6 flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {tagList.length === 0 ? (
                "Separate tags with commas or spaces."
              ) : (
                tagList.map((t) => (
                  <span key={t} className="rounded-full bg-secondary px-2.5 py-0.5 font-medium text-secondary-foreground">
                    #{t}
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border pt-5">
            <Link href="/forum" className="inline-flex h-11 items-center rounded-full px-5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              data-testid="publish"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-60"
            >
              <Send className="size-4" aria-hidden="true" /> Publish post
            </button>
          </div>
        </form>

        <aside className="flex flex-col gap-4 self-start lg:sticky lg:top-6">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Lightbulb className="size-4 text-primary" aria-hidden="true" /> Tips for a great post
            </h2>
            <ul className="mt-3 flex flex-col gap-2.5 text-sm text-muted-foreground">
              {TIPS.map((t) => (
                <li key={t} className="flex gap-2">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-muted/50 p-5 text-sm text-muted-foreground">
            Be kind and assume good intent. Posts that break the community guidelines may be removed by moderators.
          </div>
        </aside>
      </div>
    </div>
  );
}
