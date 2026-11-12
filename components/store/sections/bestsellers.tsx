"use client";

import { useState } from "react";
import { ProductCard } from "@/components/store/product-card";
import { SectionHeading } from "@/components/store/section-heading";
import { PRODUCTS, type Step } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const TABS: { id: "all" | Step; label: string }[] = [
  { id: "all", label: "All" },
  { id: "serum", label: "Serums" },
  { id: "moisturizer", label: "Moisturizers" },
  { id: "sunscreen", label: "Sun care" },
  { id: "cleanser", label: "Cleansers" },
];

export function Bestsellers() {
  const [tab, setTab] = useState<"all" | Step>("all");
  const bestsellers = PRODUCTS.filter((p) => p.bestseller);
  // Tabs with nothing to show would just be dead ends.
  const visibleTabs = TABS.filter((t) => t.id === "all" || bestsellers.some((p) => p.step === t.id));
  const shown = tab === "all" ? bestsellers : bestsellers.filter((p) => p.step === tab);

  return (
    <section aria-labelledby="bestsellers-title" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
      <SectionHeading
        id="bestsellers-title"
        eyebrow="Bestsellers"
        title="The ones everyone comes back for"
        description="Our most-loved formulas, rated by people with skin like yours."
        href="/shop?sort=best"
        hrefLabel="Shop all bestsellers"
      />

      <div role="group" aria-label="Filter bestsellers" className="mt-8 flex flex-wrap gap-2">
        {visibleTabs.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              tab === t.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:bg-muted",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-5">
        {shown.map((p) => (
          <li key={p.slug}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}
