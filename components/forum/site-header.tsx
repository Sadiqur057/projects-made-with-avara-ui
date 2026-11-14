"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import {
  NavbarBlock,
  type MegaCategory,
  type MegaNavContent,
} from "@/components/custom/blocks/NavbarBlock";
import { CATEGORIES } from "@/lib/forum/seed";
import { replyCount, sortThreads } from "@/lib/forum/selectors";
import { useForum } from "@/lib/forum/store";
import { CURRENT_USER } from "@/lib/forum/types";
import { ThemeToggle } from "./theme-toggle";

/** Categories that get a mega-menu panel. The rest are reachable from /forum. */
const MENU_CATEGORIES = ["dev", "design", "career", "showcase"] as const;

const POPULAR_TAGS: Record<(typeof MENU_CATEGORIES)[number], string[]> = {
  dev: ["react", "nextjs", "accessibility", "architecture"],
  design: ["design-systems", "tokens", "research", "motion"],
  career: ["freelance", "juniors", "management", "pricing"],
  showcase: ["feedback", "portfolio", "side-project", "pwa"],
};

export function SiteHeader() {
  const router = useRouter();
  const { state } = useForum();

  const content = useMemo<MegaNavContent>(() => {
    const categories: MegaCategory[] = MENU_CATEGORIES.map((id) => {
      const cat = CATEGORIES.find((c) => c.id === id)!;
      const top = sortThreads(
        state.threads.filter((t) => t.category === id),
        "top",
      ).slice(0, 4);
      return {
        id,
        name: cat.name,
        productsTitle: `Trending in ${cat.name}`,
        viewAllHref: `/forum?category=${id}`,
        products: top.map((t, i) => ({
          id: t.id,
          name: t.title,
          subtitle: `by ${state.users.find((u) => u.username === t.author)?.name ?? t.author}`,
          price: `▲ ${t.votes}`,
          tag: i === 0 ? "Top" : undefined,
          rating: replyCount(state, t.id),
          emoji: cat.emoji,
          href: `/thread/${t.id}`,
        })),
        column1Title: "Browse",
        column1Links: [
          { name: "Newest", href: `/forum?category=${id}&sort=new` },
          { name: "Top voted", href: `/forum?category=${id}&sort=top` },
          { name: "Hot right now", href: `/forum?category=${id}&sort=hot` },
        ],
        column2Title: "Popular tags",
        column2Links: POPULAR_TAGS[id].map((tag) => ({
          name: `#${tag}`,
          href: `/forum?q=${encodeURIComponent(tag)}`,
        })),
        promo: {
          tag: cat.name,
          title: `Start a ${cat.name.toLowerCase()} discussion`,
          subtitle: cat.description,
          cta: "Write a post",
          emoji: cat.emoji,
          href: `/new?category=${id}`,
        },
      };
    });

    return {
      announcement: "Weekly AMA every Friday · Join 24,000+ builders, designers and makers",
      categories,
      staticLinks: [
        { name: "All discussions", href: "/forum" },
        { name: "Newest", href: "/forum?sort=new" },
      ],
      dealsLabel: "Trending",
      dealsHref: "/forum?sort=hot",
      searchItems: state.threads.map((t) => ({ title: t.title, path: `/thread/${t.id}` })),
      searchPlaceholder: "Search discussions, tags, people…",
      onSearch: (q) => router.push(`/forum?q=${encodeURIComponent(q)}`),
      accountHref: `/u/${CURRENT_USER}`,
      ctaLabel: "New post",
      ctaHref: "/new",
      actionsSlot: <ThemeToggle />,
    };
  }, [state, router]);

  return (
    <header className="relative z-50 bg-background">
      <NavbarBlock
        variant="ecommerce-mega-nav"
        logoText="Commonroom"
        color="primary"
        linkComponent={Link}
        megaNav={content}
      />
    </header>
  );
}
