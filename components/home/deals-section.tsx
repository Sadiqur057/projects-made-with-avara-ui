"use client";

import Link from "next/link";
import { Flame, MapPin } from "lucide-react";
import { Countdown } from "@/components/site/countdown";
import { WishlistButton } from "@/components/site/wishlist-button";
import { DEALS, dealPrice, getDestination, packageImage, type TravelPackage } from "@/lib/travel-data";
import { addDays, fmtDate, money, toIso } from "@/lib/format";
import { useNow } from "@/lib/store";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function DealCard({ pkg, index }: { pkg: TravelPackage; index: number }) {
  const now = useNow(60_000);
  const deal = pkg.deal!;
  const dest = getDestination(pkg.destination)!;
  const departs = now === null ? null : toIso(addDays(new Date(now), deal.departsInDays));
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-sm">
      <div className="relative aspect-[16/10] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={packageImage(pkg)} alt={`${pkg.title}`} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-sun px-3 py-1 text-xs font-bold text-sun-foreground">
          <Flame className="size-3.5" /> {deal.discount}% OFF
        </span>
        <WishlistButton slug={pkg.slug} title={pkg.title} className="absolute right-3 top-3 z-10" />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <p className="inline-flex items-center gap-1 text-xs text-white/70"><MapPin className="size-3.5" /> {dest.name}, {dest.country} · {pkg.days} days</p>
          <h3 className="mt-1 text-xl font-semibold">
            <Link href={`/packages/${pkg.slug}?deal=1`} className="after:absolute after:inset-0">{pkg.title}</Link>
          </h3>
          <p className="mt-1 text-sm text-white/70">
            Departs {departs ? fmtDate(departs) : "…"} ·{" "}
            <span className="font-semibold text-sun">only {deal.seatsLeft} places left</span>
          </p>
        </div>
        <div>
          <p className="mb-1.5 text-[11px] uppercase tracking-widest text-white/60">Offer ends in</p>
          <Countdown offset={index} tone="bg-white/10" />
        </div>
        <div className="mt-auto flex items-end justify-between border-t border-white/10 pt-4">
          <div>
            <span className="mr-2 text-sm text-white/55 line-through tabular-nums">{money(pkg.price)}</span>
            <span className="text-2xl font-semibold tabular-nums">{money(dealPrice(pkg))}</span>
            <span className="text-xs text-white/60"> /person</span>
          </div>
          <span className={cn(buttonVariants({ size: "sm" }), "pointer-events-none bg-white text-black")}>Book deal</span>
        </div>
      </div>
    </article>
  );
}

export function DealsGrid() {
  const deals = DEALS.slice(0, 6);
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {deals.map((p, i) => (
        <DealCard key={p.slug} pkg={p} index={i} />
      ))}
    </div>
  );
}
