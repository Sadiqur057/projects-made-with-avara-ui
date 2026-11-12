"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CalendarDays } from "lucide-react";
import { DESTINATIONS, REGIONS, packagesFor, type Region } from "@/lib/travel-data";
import { money } from "@/lib/format";
import { cn } from "@/lib/utils";

type Filter = Region | "All";

export function DestinationsBrowser() {
  const params = useSearchParams();
  const fromUrl = params.get("region");
  const [region, setRegion] = useState<Filter>(REGIONS.includes(fromUrl as Region) ? (fromUrl as Region) : "All");
  const list = region === "All" ? DESTINATIONS : DESTINATIONS.filter((d) => d.region === region);
  const filters: Filter[] = ["All", ...REGIONS];

  return (
    <div>
      <div role="group" aria-label="Filter by region" className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const count = f === "All" ? DESTINATIONS.length : DESTINATIONS.filter((d) => d.region === f).length;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={region === f}
              onClick={() => setRegion(f)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                region === f ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-muted",
              )}
            >
              {f} <span className="opacity-60">· {count}</span>
            </button>
          );
        })}
      </div>

      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((d) => {
          const pkgs = packagesFor(d.slug);
          const from = Math.min(...pkgs.map((p) => p.price));
          return (
            <li key={d.slug} className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg">
              <div className="relative aspect-[4/3] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={d.image} alt={`${d.name}, ${d.country}`} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium backdrop-blur">{d.region}</span>
              </div>
              <div className="grid gap-3 p-5">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">{d.country}</p>
                  <h3 className="text-2xl font-semibold">
                    <Link href={`/packages?destination=${d.slug}`} className="after:absolute after:inset-0">{d.name}</Link>
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">{d.tagline}</p>
                <div className="flex items-center justify-between border-t border-border pt-4 text-sm">
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground"><CalendarDays className="size-4" /> {d.bestTime}</span>
                  <span className="font-medium">
                    {pkgs.length} {pkgs.length === 1 ? "trip" : "trips"} · from {money(from)}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                  See trips <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
