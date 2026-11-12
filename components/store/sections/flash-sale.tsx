"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Zap } from "lucide-react";
import { CounterBlock } from "@/components/custom/blocks/CounterBlock";
import { products } from "@/lib/store/products";
import { ProductCard } from "../product-card";
import { Section } from "../section-heading";

const deals = products.filter((p) => p.flashSale);

/** The sale rolls over every night: it always ends at the next local midnight. */
function endOfToday() {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}

const subscribe = () => () => {};

export function FlashSaleSection() {
  // `null` on the server and during hydration, so nothing time-dependent is prerendered.
  const end = useSyncExternalStore(subscribe, endOfToday, () => null);

  return (
    <section id="flash-sale" className="scroll-mt-24 bg-primary/[0.07]">
      <Section className="py-16 sm:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground">
              <Zap className="size-3.5 fill-current" /> Flash sale
            </p>
            <h2 className="font-heading mt-4 text-5xl leading-[1.02] sm:text-6xl">
              Up to 25% off. <span className="italic text-primary">Tonight only.</span>
            </h2>
            <p className="mt-3 max-w-md text-muted-foreground">Our most-loved pieces at their lowest prices this season. When the clock hits zero, prices go back.</p>
          </div>
          <div className="min-h-[96px]" aria-live="off">
            {end !== null && <CounterBlock type="countdown" variant="slide" color="primary" label="Sale ends in" targetDate={end} doneLabel="This sale has ended, new deals drop tomorrow" />}
          </div>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-5">
          {deals.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
          <li className="col-span-2 flex items-center justify-center rounded-2xl border border-dashed border-primary/40 p-6 text-center lg:col-span-1">
            <div>
              <p className="font-heading text-3xl">More deals</p>
              <p className="mt-1 text-sm text-muted-foreground">Everything on sale, in one place.</p>
              <Link href="/shop?sale=1" className="mt-4 inline-flex h-10 items-center rounded-full bg-foreground px-5 text-sm font-semibold text-background transition hover:bg-foreground/85">
                Shop sale
              </Link>
            </div>
          </li>
        </ul>
      </Section>
    </section>
  );
}
