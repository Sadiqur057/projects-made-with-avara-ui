"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MasonryGrid } from "@/components/custom/blocks/MasonryGridBlock";
import { lookbook } from "@/lib/store/products";
import { Section, SectionHeading } from "../section-heading";

const items = lookbook.map((l, i) => ({ ...l, id: i }));

export function LookbookSection() {
  return (
    <Section id="lookbook">
      <SectionHeading eyebrow="AW26 Lookbook" title={<>Stories we <span className="italic text-primary">dressed</span> this season</>} action={{ label: "Shop the looks", href: "/shop" }} />
      <MasonryGrid
        className="mt-10"
        items={items}
        columnsClassName="columns-2 lg:columns-4"
        gapClassName="gap-4"
        renderItem={(item) => (
          <Link href="/shop" className={`group relative block overflow-hidden rounded-2xl bg-muted ${item.ratio}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.src} alt={item.alt} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            <span className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
            <span className="absolute inset-x-4 bottom-4 flex translate-y-2 items-end justify-between text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
              <span>
                <span className="block text-xs uppercase tracking-widest text-white/75">{item.season}</span>
                <span className="font-heading block text-2xl">{item.title}</span>
              </span>
              <ArrowUpRight className="size-5" />
            </span>
          </Link>
        )}
      />
    </Section>
  );
}
