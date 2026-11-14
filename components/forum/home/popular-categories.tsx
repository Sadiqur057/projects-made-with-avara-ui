"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/custom/blocks/CardBlock";
import { CATEGORIES } from "@/lib/forum/seed";
import { categoryThreadCount, formatCount } from "@/lib/forum/selectors";
import { useForum } from "@/lib/forum/store";
import { SectionHeader } from "./section-header";

export function PopularCategories() {
  const { state } = useForum();

  return (
    <section aria-labelledby="categories-heading" className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <div id="categories-heading">
        <SectionHeader
          eyebrow="Popular categories"
          title="Find the room that fits your question"
          description="Every topic has its own space, so the right people see your post and the best answers rise to the top."
        />
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((cat) => (
          <li key={cat.id}>
            <Link
              href={`/forum?category=${cat.id}`}
              data-testid={`category-${cat.id}`}
              className="group block h-full rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <Card interactive className="h-full">
                <CardHeader className="gap-3">
                  <div className="flex items-start justify-between">
                    <span
                      className="grid size-12 place-items-center rounded-xl bg-primary/10 text-2xl"
                      aria-hidden="true"
                    >
                      {cat.emoji}
                    </span>
                    <ArrowUpRight
                      className="size-5 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <CardTitle>{cat.name}</CardTitle>
                  <CardDescription>{cat.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <span className="text-sm font-medium text-primary">
                    {formatCount(categoryThreadCount(state, cat.id))} discussions
                  </span>
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
