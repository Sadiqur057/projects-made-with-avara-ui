/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import { discountPct, products, usd } from "@/lib/products";

const DEALS = [
  { slug: "pulse-watch-s2", sold: 78 },
  { slug: "orbit-smart-speaker", sold: 64 },
  { slug: "lens-m3-mirrorless-camera", sold: 91 },
  { slug: "forge-desk-setup-kit", sold: 52 },
].map((d) => ({ ...d, product: products.find((p) => p.slug === d.slug)! }));

const SALE_LENGTH_MS = 1000 * 60 * 60 * 9 + 1000 * 60 * 24 + 1000 * 37;

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Counts down a rolling sale window. The clock only starts after mount, so the
 * server render and the first client render agree (they both show dashes).
 */
function useCountdown() {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const end = Date.now() + SALE_LENGTH_MS;
    const tick = () => setLeft(Math.max(0, end - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (left === null) return null;
  const total = Math.floor(left / 1000);
  return {
    hours: pad(Math.floor(total / 3600)),
    minutes: pad(Math.floor((total % 3600) / 60)),
    seconds: pad(total % 60),
  };
}

function Digit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex min-w-16 flex-col items-center rounded-2xl bg-primary-foreground/10 px-3 py-2.5 ring-1 ring-primary-foreground/20 sm:min-w-20 sm:py-3">
      <span className="text-3xl font-extrabold tabular-nums leading-none sm:text-4xl">
        {value}
      </span>
      <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-widest opacity-75">
        {label}
      </span>
    </div>
  );
}

export function FlashSale() {
  const time = useCountdown();

  return (
    <section
      id="flash-sale"
      className="mx-auto w-full max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24"
    >
      <div className="relative overflow-hidden rounded-[2rem] bg-primary text-primary-foreground">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-primary-foreground/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-16 size-96 rounded-full bg-foreground/20 blur-3xl"
        />

        <div className="relative grid gap-10 p-6 sm:p-10 lg:grid-cols-12 lg:gap-12 lg:p-14">
          <div className="space-y-6 lg:col-span-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-bold uppercase tracking-wider">
              <Zap className="size-3.5 fill-current" /> Flash sale
            </span>
            <h2 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
              Up to 34% off. Today only.
            </h2>
            <p className="max-w-sm text-sm leading-relaxed opacity-85 sm:text-base">
              Our biggest deals of the week on the gear you actually want. When the
              timer hits zero, the prices go back up.
            </p>

            <div
              role="timer"
              aria-label="Time left in the flash sale"
              className="flex items-center gap-2 sm:gap-3"
            >
              <Digit value={time?.hours ?? "--"} label="Hours" />
              <span aria-hidden className="text-2xl font-bold opacity-60">:</span>
              <Digit value={time?.minutes ?? "--"} label="Mins" />
              <span aria-hidden className="text-2xl font-bold opacity-60">:</span>
              <Digit value={time?.seconds ?? "--"} label="Secs" />
            </div>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {DEALS.map(({ product, sold }) => (
              <li key={product.slug}>
                <Link
                  href={`/products/${product.slug}`}
                  className="group flex h-full gap-4 rounded-3xl bg-background p-3 text-foreground shadow-lg shadow-foreground/10 transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <div className="relative size-28 shrink-0 overflow-hidden rounded-2xl bg-muted sm:size-32">
                    <img
                      src={product.images[0]}
                      alt=""
                      loading="lazy"
                      width={400}
                      height={400}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-extrabold text-primary-foreground">
                      -{discountPct(product)}%
                    </span>
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                        {product.category}
                      </p>
                      <h3 className="mt-0.5 line-clamp-2 text-sm font-bold leading-snug sm:text-base">
                        {product.name}
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-extrabold">{usd(product.price)}</span>
                        <span className="text-xs text-muted-foreground line-through">
                          {usd(product.originalPrice)}
                        </span>
                      </div>
                      <div>
                        <div
                          role="progressbar"
                          aria-valuenow={sold}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${sold}% claimed`}
                          className="h-1.5 overflow-hidden rounded-full bg-muted"
                        >
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${sold}%` }}
                          />
                        </div>
                        <p className="mt-1 text-[11px] font-medium text-muted-foreground">
                          {sold}% claimed
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
