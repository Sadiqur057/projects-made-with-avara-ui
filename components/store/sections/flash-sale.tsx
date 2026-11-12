"use client";

import { Zap } from "lucide-react";
import { ProductCard } from "@/components/store/product-card";
import { FLASH_SALE, getProduct } from "@/lib/catalog";
import { msUntilMidnight, splitDuration, useClock } from "@/lib/clock";

const pad = (n: number) => String(n).padStart(2, "0");

function Countdown() {
  const now = useClock();
  const { hours, minutes, seconds } =
    now === null ? { hours: null, minutes: null, seconds: null } : splitDuration(msUntilMidnight(now));

  const cells = [
    { label: "Hours", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
  ];

  return (
    <div
      role="timer"
      aria-label={
        hours === null
          ? "Time left in the sale"
          : `${hours} hours, ${minutes} minutes and ${seconds} seconds left`
      }
      className="flex items-center gap-2 sm:gap-3"
    >
      {cells.map((c, i) => (
        <div key={c.label} className="flex items-center gap-2 sm:gap-3">
          <div className="flex w-[4.5rem] flex-col items-center rounded-2xl border border-border bg-card px-2 py-3 sm:w-24 sm:py-4">
            <span className="font-display text-4xl font-medium leading-none tabular-nums text-foreground sm:text-5xl">
              {c.value === null ? "––" : pad(c.value)}
            </span>
            <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {c.label}
            </span>
          </div>
          {i < cells.length - 1 && (
            <span aria-hidden="true" className="font-display text-3xl text-muted-foreground">
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export function FlashSale() {
  const items = FLASH_SALE.items
    .map((i) => ({ ...i, product: getProduct(i.slug) }))
    .filter((i): i is typeof i & { product: NonNullable<typeof i.product> } => !!i.product);

  return (
    // `dark` re-scopes the tokens, so the band is dark by day and by night.
    <section
      id="flash-sale"
      aria-labelledby="flash-title"
      className="dark scroll-mt-24 bg-background text-foreground"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-sale px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-sale-foreground">
              <Zap className="size-3.5" aria-hidden="true" />
              Flash sale
            </p>
            <h2
              id="flash-title"
              className="mt-4 font-display text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl"
            >
              {Math.round(FLASH_SALE.discount * 100)}% off four favourites.
              <span className="block italic text-primary">Today only.</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Prices drop automatically in your bag. The sale resets at midnight, and once a batch is
              gone it&apos;s gone.
            </p>
          </div>
          <Countdown />
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {items.map(({ product, claimed }) => (
            <li key={product.slug} className="flex flex-col gap-3">
              <ProductCard product={product} />
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">{Math.round(claimed * 100)}% claimed</span>
                  <span className="text-muted-foreground">
                    {claimed >= 0.8 ? "Almost gone" : "Selling fast"}
                  </span>
                </div>
                <div
                  role="progressbar"
                  aria-label={`${product.name}: ${Math.round(claimed * 100)}% of the sale batch claimed`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(claimed * 100)}
                  className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted"
                >
                  <div className="h-full rounded-full bg-sale" style={{ width: `${claimed * 100}%` }} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
