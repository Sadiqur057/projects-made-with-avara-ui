"use client";

import { useId, useState } from "react";
import { ArrowRight, Bike, Dumbbell, Flame, Flower2, Swords } from "lucide-react";
import { CATEGORIES, CLASSES, type CategoryId } from "@/lib/gym-data";
import { ClassCard } from "@/components/site/class-card";
import { Container, LinkButton, SectionHeading } from "@/components/site/ui";
import { cn } from "@/lib/utils";

const ICONS = { Dumbbell, Flame, Flower2, Swords, Bike } as const;

export function ClassesByCategory() {
  const [active, setActive] = useState<CategoryId>("strength");
  const baseId = useId();
  const category = CATEGORIES.find((c) => c.id === active)!;
  const items = CLASSES.filter((c) => c.category === active);

  return (
    <section id="classes" className="border-y border-border bg-card/30 py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Classes"
          title="Find your class"
          description="Five categories, every level. Pick a style and see what is on the timetable."
          action={
            <LinkButton href="/classes" variant="outline">
              All classes <ArrowRight className="size-4" aria-hidden />
            </LinkButton>
          }
        />

        <div
          role="tablist"
          aria-label="Class categories"
          className="mt-10 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]"
        >
          {CATEGORIES.map((c) => {
            const Icon = ICONS[c.icon];
            const selected = c.id === active;
            return (
              <button
                key={c.id}
                id={`${baseId}-tab-${c.id}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={`${baseId}-panel`}
                onClick={() => setActive(c.id)}
                className={cn(
                  "inline-flex h-11 shrink-0 items-center gap-2 rounded-full border px-5 text-sm font-semibold transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-4" aria-hidden />
                {c.label}
              </button>
            );
          })}
        </div>

        <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-tab-${active}`} className="mt-8">
          <p className="mb-6 text-muted-foreground">{category.tagline}</p>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li key={item.slug}>
                <ClassCard item={item} />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
