"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { products } from "@/lib/store/products";
import { ProductCard } from "../product-card";
import { Section, SectionHeading } from "../section-heading";

const arrivals = [...products].filter((p) => p.isNew).sort((a, b) => b.released - a.released);

export function NewArrivalsSection() {
  const rail = useRef<HTMLUListElement>(null);
  const scroll = (dir: 1 | -1) => rail.current?.scrollBy({ left: dir * (rail.current.clientWidth * 0.8), behavior: "smooth" });

  return (
    <Section id="new">
      <div className="flex items-end justify-between gap-4">
        <SectionHeading eyebrow="Just landed" title="New arrivals" action={{ label: "See everything new", href: "/shop?sort=newest" }} className="flex-1" />
        <div className="hidden gap-2 sm:flex">
          <button type="button" aria-label="Scroll left" onClick={() => scroll(-1)} className="grid size-10 place-items-center rounded-full border border-border transition hover:bg-foreground hover:text-background">
            <ArrowLeft className="size-4" />
          </button>
          <button type="button" aria-label="Scroll right" onClick={() => scroll(1)} className="grid size-10 place-items-center rounded-full border border-border transition hover:bg-foreground hover:text-background">
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
      <ul
        ref={rail}
        className="-mx-4 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-4 [scrollbar-width:none] sm:-mx-6 sm:px-6 [&::-webkit-scrollbar]:hidden"
        aria-label="New arrivals"
      >
        {arrivals.map((p) => (
          <li key={p.id} className="w-[68%] shrink-0 snap-start sm:w-[38%] md:w-[30%] lg:w-[23.5%]">
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
