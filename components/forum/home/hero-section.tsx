"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Code2, Palette, Rocket, Search } from "lucide-react";
import { SupportHero } from "@/components/custom/blocks/SupportHeroBlock";
import { communityStats, topContributors, trendingThreads } from "@/lib/forum/selectors";
import { avatarSrc } from "@/lib/forum/format";
import { useForum } from "@/lib/forum/store";

const SUGGESTIONS = ["design-systems", "react", "accessibility", "freelance"];

function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-balance">
        Ask questions, share what you&apos;re building and learn from people who have shipped it before.
      </p>
      <form
        role="search"
        className="relative w-full"
        onSubmit={(e) => {
          e.preventDefault();
          const q = query.trim();
          router.push(q ? `/forum?q=${encodeURIComponent(q)}` : "/forum");
        }}
      >
        <label htmlFor="hero-search" className="sr-only">
          Search the forum
        </label>
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          id="hero-search"
          name="q"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search discussions, tags or people…"
          autoComplete="off"
          className="h-12 w-full rounded-full border border-border bg-card pl-11 pr-28 text-sm text-foreground shadow-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 h-9 -translate-y-1/2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Search
        </button>
      </form>
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-xs">
        <span className="text-muted-foreground">Popular:</span>
        {SUGGESTIONS.map((tag) => (
          <Link
            key={tag}
            href={`/forum?q=${encodeURIComponent(tag)}`}
            className="rounded-full border border-border bg-card/70 px-2.5 py-1 font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            #{tag}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function HeroSection() {
  const router = useRouter();
  const { state } = useForum();
  const stats = communityStats(state);
  const faces = topContributors(state, 6).map(({ user }) => ({
    src: avatarSrc(user.username, user.name),
    alt: user.name,
  }));
  const top = trendingThreads(state, 1)[0];

  return (
    <SupportHero
      heading="Where builders think out loud"
      subtitle={<HeroSearch />}
      cta={{ label: "Start a discussion", onClick: () => router.push("/new") }}
      reveal="immediate"
    >
      <SupportHero.Integrations
        icons={[<Code2 key="c" aria-hidden="true" />, <Palette key="p" aria-hidden="true" />, <Rocket key="r" aria-hidden="true" />]}
        title="6 topics"
        text="Development, design, careers, showcases and everything in between"
      />
      <SupportHero.Stat
        value={Number((stats.members / 1000).toFixed(1))}
        decimals={1}
        suffix="k"
        caption="Members sharing what they know"
      />
      <SupportHero.Stat
        tone="accent"
        value={Number((stats.discussions / 1000).toFixed(1))}
        decimals={1}
        suffix="k"
        caption="Discussions started and counting"
      />
      <SupportHero.Stat
        value={Number((stats.replies / 1000).toFixed(0))}
        suffix="k"
        caption="Replies from helpful humans"
      />
      <SupportHero.Team
        title={
          <>
            Friendly faces,
            <br />
            real answers
          </>
        }
        avatars={faces}
      />
      {top && (
        <SupportHero.Card className="md:col-span-6 lg:col-span-6">
          <Link
            href={`/thread/${top.id}`}
            className="flex h-full flex-col justify-between p-6 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Trending right now
            </span>
            <span className="line-clamp-3 text-xl font-semibold leading-snug tracking-tight">
              {top.title}
            </span>
            <span className="text-xs text-foreground/60">▲ {top.votes} upvotes · Read the discussion →</span>
          </Link>
        </SupportHero.Card>
      )}
    </SupportHero>
  );
}
