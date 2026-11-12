"use client";

import Link from "next/link";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/custom/blocks/ToggleGroupBlock";
import { categories, productsByCategory, type CategoryId } from "@/lib/store/products";
import { ProductCard } from "../product-card";
import { Section, SectionHeading } from "../section-heading";

export function ByCategorySection() {
  const [active, setActive] = useState<CategoryId>("dresses");
  const list = productsByCategory(active).slice(0, 4);
  const current = categories.find((c) => c.id === active)!;

  return (
    <Section id="categories">
      <SectionHeading eyebrow="Browse" title="Shop by category" action={{ label: `All ${current.name.toLowerCase()}`, href: `/shop?category=${active}` }} />

      <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6" aria-label="Categories">
        {categories.map((c) => (
          <li key={c.id}>
            <Link href={`/shop?category=${c.id}`} className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.image} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <span className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
              <span className="absolute inset-x-3 bottom-3 text-white">
                <span className="block text-lg font-medium leading-tight">{c.name}</span>
                <span className="block text-xs text-white/80">{productsByCategory(c.id).length} styles</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-14 flex flex-wrap items-center justify-between gap-4">
        <h3 className="font-heading text-3xl">Trending in {current.name.toLowerCase()}</h3>
        <div className="max-w-full overflow-x-auto">
          <ToggleGroup type="single" variant="segmented" size="sm" value={active} onValueChange={(v) => v && setActive(v as CategoryId)} aria-label="Pick a category">
            {categories.map((c) => (
              <ToggleGroupItem key={c.id} value={c.id}>
                {c.name}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>
      <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
        {list.map((p) => (
          <li key={p.id}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
