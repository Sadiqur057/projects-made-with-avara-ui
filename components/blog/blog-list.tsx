"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Clock } from "lucide-react";
import { BLOG, type BlogPost } from "@/lib/travel-data";
import { cn } from "@/lib/utils";

const fmt = new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
export const postDate = (iso: string) => fmt.format(new Date(iso));

function PostCard({ post }: { post: BlogPost }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg">
      <div className="aspect-[16/10] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.image} alt="" loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="rounded-full bg-secondary px-2.5 py-0.5 font-medium text-secondary-foreground">{post.category}</span>
          <span className="inline-flex items-center gap-1"><Clock className="size-3.5" /> {post.readMinutes} min read</span>
        </div>
        <h3 className="text-xl font-semibold leading-snug">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">{post.title}</Link>
        </h3>
        <p className="line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
        <p className="mt-auto pt-2 text-xs text-muted-foreground">{post.author} · {postDate(post.date)}</p>
      </div>
    </article>
  );
}

export function BlogList() {
  const cats = ["All", "Guides", "Tips", "Stories"] as const;
  const [cat, setCat] = useState<(typeof cats)[number]>("All");
  const posts = BLOG.filter((p) => cat === "All" || p.category === cat);
  const [lead, ...rest] = posts;

  return (
    <div>
      <div role="group" aria-label="Filter articles" className="flex flex-wrap gap-2">
        {cats.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={cat === c}
            onClick={() => setCat(c)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              cat === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-muted",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {lead && (
        <article className="group relative mt-8 grid overflow-hidden rounded-3xl border border-border bg-card md:grid-cols-2">
          <div className="aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-80">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lead.image} alt="" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
          <div className="flex flex-col justify-center gap-4 p-7 sm:p-10">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="rounded-full bg-accent px-2.5 py-0.5 font-medium text-accent-foreground">{lead.category}</span>
              <span>{postDate(lead.date)} · {lead.readMinutes} min read</span>
            </div>
            <h2 className="text-balance text-3xl font-semibold">
              <Link href={`/blog/${lead.slug}`} className="after:absolute after:inset-0">{lead.title}</Link>
            </h2>
            <p className="text-muted-foreground">{lead.excerpt}</p>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">Read the guide <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span>
          </div>
        </article>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>
    </div>
  );
}
