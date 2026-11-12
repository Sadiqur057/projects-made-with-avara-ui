"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, Share2, Trash2 } from "lucide-react";
import { PackageCard } from "@/components/site/package-card";
import { buttonVariants } from "@/components/ui/button";
import { useHydrated, useWishlist } from "@/lib/store";
import { PACKAGES, dealPrice } from "@/lib/travel-data";
import { money } from "@/lib/format";
import { cn } from "@/lib/utils";

export function WishlistView() {
  const { ids, clear } = useWishlist();
  const hydrated = useHydrated();
  const [copied, setCopied] = useState(false);
  const saved = PACKAGES.filter((p) => ids.includes(p.slug));
  const cheapest = saved.length ? Math.min(...saved.map((p) => p.price)) : 0;
  const total = saved.reduce((s, p) => s + p.price, 0);

  const share = async () => {
    const text = `My ${saved.length} saved Wayfare trips: ${saved.map((p) => p.title).join(", ")}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  if (!hydrated) {
    return <div className="h-72 animate-pulse rounded-2xl bg-muted" aria-label="Loading wishlist" />;
  }

  if (saved.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-dashed border-border px-6 py-20 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-secondary text-primary">
          <Heart className="size-7" />
        </span>
        <h2 className="mt-6 text-2xl font-semibold">Nothing saved yet</h2>
        <p className="mt-2 max-w-md text-muted-foreground">Tap the heart on any trip to keep it here. Your list is saved on this device.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/packages" className={cn(buttonVariants({ size: "lg" }), "h-11 rounded-full px-6")}>Browse packages</Link>
          <Link href="/destinations" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 rounded-full px-6")}>See destinations</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5">
        <div className="text-sm">
          <span className="font-semibold">{saved.length} saved {saved.length === 1 ? "trip" : "trips"}</span>
          <span className="text-muted-foreground"> · from {money(cheapest)} · {money(total)} for one adult on each</span>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={share} className={cn(buttonVariants({ variant: "outline" }), "h-9 rounded-full px-4")}>
            <Share2 className="size-4" /> {copied ? "Copied!" : "Copy list"}
          </button>
          <button type="button" onClick={clear} className={cn(buttonVariants({ variant: "ghost" }), "h-9 rounded-full px-4 text-destructive hover:text-destructive")}>
            <Trash2 className="size-4" /> Clear all
          </button>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {saved.map((p) => (
          <div key={p.slug} className="flex flex-col gap-3">
            <PackageCard pkg={p} className="flex-1" />
            <div className="flex gap-2">
              <Link href={`/packages/${p.slug}`} className={cn(buttonVariants({ size: "lg" }), "h-10 flex-1 rounded-full")}>Book this trip</Link>
              {p.deal && (
                <Link href={`/packages/${p.slug}?deal=1`} className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "h-10 rounded-full")}>
                  Deal {money(dealPrice(p))}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
