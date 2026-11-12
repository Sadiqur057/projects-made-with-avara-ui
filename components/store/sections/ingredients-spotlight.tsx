"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { SectionHeading } from "@/components/store/section-heading";
import { ProductImage } from "@/components/store/product-image";
import { INGREDIENTS, productsWithIngredient } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const STRENGTH_LEVEL: Record<string, number> = {
  Gentle: 1,
  Active: 2,
  Strong: 3,
};

function strengthOf(label: string) {
  const key = label.split(" ")[0];
  return STRENGTH_LEVEL[key] ?? 1;
}

export function IngredientsSpotlight() {
  const [activeId, setActiveId] = useState(INGREDIENTS[0].id);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const active = INGREDIENTS.find((i) => i.id === activeId) ?? INGREDIENTS[0];
  const found = productsWithIngredient(active.id);
  const level = strengthOf(active.strength);

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    const last = INGREDIENTS.length - 1;
    let next = index;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = index === last ? 0 : index + 1;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    setActiveId(INGREDIENTS[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="ingredients" aria-labelledby="ingredients-title" className="scroll-mt-24 bg-accent/45">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <SectionHeading
          id="ingredients-title"
          eyebrow="Ingredients spotlight"
          title="Seven ingredients, explained plainly"
          description="No mystery lists. Here's what each hero ingredient does, who it's for, and what it plays nicely with."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[18rem_1fr] lg:gap-10">
          <div
            role="tablist"
            aria-label="Ingredients"
            aria-orientation="vertical"
            className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {INGREDIENTS.map((ing, i) => {
              const selected = ing.id === activeId;
              return (
                <button
                  key={ing.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`ing-tab-${ing.id}`}
                  aria-selected={selected}
                  aria-controls="ing-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveId(ing.id)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className={cn(
                    "shrink-0 rounded-2xl border px-4 py-3 text-left transition-colors lg:w-full",
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card/60 hover:bg-card",
                  )}
                >
                  <span className="block font-display text-lg leading-tight">{ing.name}</span>
                  <span className={cn("block text-xs", selected ? "opacity-85" : "opacity-65")}>{ing.tagline}</span>
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id="ing-panel"
            aria-labelledby={`ing-tab-${active.id}`}
            className="grid gap-8 rounded-3xl bg-card p-6 text-foreground sm:p-8 lg:grid-cols-[1.1fr_1fr]"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{active.tagline}</p>
              <h3 className="mt-2 font-display text-4xl font-medium tracking-tight sm:text-5xl">{active.name}</h3>
              <p className="mt-4 text-base leading-relaxed text-foreground/80">{active.does}</p>

              <dl className="mt-6 grid gap-5 text-sm">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Best for</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {active.bestFor.map((b) => (
                      <span key={b} className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                        {b}
                      </span>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Strength</dt>
                  <dd className="mt-2 flex items-center gap-3">
                    <span className="flex gap-1" aria-hidden="true">
                      {[1, 2, 3].map((n) => (
                        <span key={n} className={cn("h-2 w-8 rounded-full", n <= level ? "bg-primary" : "bg-border")} />
                      ))}
                    </span>
                    <span className="text-foreground">{active.strength}</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pairs with</dt>
                  <dd className="mt-1 text-foreground/80">{active.pairsWith}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Good to know</dt>
                  <dd className="mt-1 text-foreground/80">{active.careWith}</dd>
                </div>
              </dl>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Find it in</p>
              <ul className="mt-3 grid gap-3">
                {found.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/shop/${p.slug}`}
                      className="group flex items-center gap-3 rounded-2xl border border-border bg-background p-2.5 transition-colors hover:border-primary"
                    >
                      <span className="size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                        <ProductImage slug={p.slug} view={1} />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-display text-base text-foreground group-hover:text-primary">
                          {p.name}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">{p.tagline}</span>
                      </span>
                    </Link>
                  </li>
                ))}
                {found.length === 0 && (
                  <li className="text-sm text-muted-foreground">Coming to a formula soon.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
