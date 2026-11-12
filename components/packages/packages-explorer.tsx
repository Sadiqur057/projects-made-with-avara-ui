"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { PackageCard } from "@/components/site/package-card";
import {
  CATEGORIES,
  DESTINATIONS,
  DURATION_FILTERS,
  PACKAGES,
  PRICE_MAX,
  PRICE_MIN,
  type Category,
  type DurationId,
} from "@/lib/travel-data";
import { money } from "@/lib/format";
import { cn } from "@/lib/utils";

type Sort = "recommended" | "price-asc" | "price-desc" | "duration-asc";

const SORTS: { id: Sort; label: string }[] = [
  { id: "recommended", label: "Recommended" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "duration-asc", label: "Duration: shortest" },
];

const isDuration = (v: string | null): v is DurationId => DURATION_FILTERS.some((d) => d.id === v);
const isCategory = (v: string | null): v is Category => CATEGORIES.some((c) => c.id === v);

const controlClass =
  "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40";

export function PackagesExplorer() {
  const params = useSearchParams();
  const initialCategory = params.get("category");
  const initialDuration = params.get("duration");
  const initialDestination = params.get("destination");

  const [query, setQuery] = useState(params.get("q") ?? "");
  const [destination, setDestination] = useState(DESTINATIONS.some((d) => d.slug === initialDestination) ? initialDestination! : "");
  const [category, setCategory] = useState<Category | "">(isCategory(initialCategory) ? initialCategory : "");
  const [duration, setDuration] = useState<DurationId>(isDuration(initialDuration) ? initialDuration : "any");
  const [price, setPrice] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);
  const [sort, setSort] = useState<Sort>("recommended");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const travellers = params.get("travellers");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const durationTest = DURATION_FILTERS.find((d) => d.id === duration)!.test;
    const list = PACKAGES.filter((p) => {
      const dest = DESTINATIONS.find((d) => d.slug === p.destination)!;
      if (q && !`${p.title} ${dest.name} ${dest.country} ${p.category}`.toLowerCase().includes(q)) return false;
      if (destination && p.destination !== destination) return false;
      if (category && p.category !== category) return false;
      if (!durationTest(p.days)) return false;
      if (p.price < price[0] || p.price > price[1]) return false;
      return true;
    });
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    else if (sort === "duration-asc") sorted.sort((a, b) => a.days - b.days);
    else sorted.sort((a, b) => b.rating * Math.log(b.reviews) - a.rating * Math.log(a.reviews));
    return sorted;
  }, [query, destination, category, duration, price, sort]);

  const activeCount =
    (query ? 1 : 0) +
    (destination ? 1 : 0) +
    (category ? 1 : 0) +
    (duration !== "any" ? 1 : 0) +
    (price[0] !== PRICE_MIN || price[1] !== PRICE_MAX ? 1 : 0);

  const reset = () => {
    setQuery("");
    setDestination("");
    setCategory("");
    setDuration("any");
    setPrice([PRICE_MIN, PRICE_MAX]);
    setSort("recommended");
  };

  const filters = (
    <div className="grid gap-6">
      <label className="grid gap-2 text-sm font-medium">
        Search
        <span className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Bali, safari, honeymoon…"
            className={cn(controlClass, "pl-9")}
          />
        </span>
      </label>

      <label className="grid gap-2 text-sm font-medium">
        Destination
        <select value={destination} onChange={(e) => setDestination(e.target.value)} className={controlClass}>
          <option value="">All destinations</option>
          {DESTINATIONS.map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.name}, {d.country}
            </option>
          ))}
        </select>
      </label>

      <fieldset className="grid gap-2">
        <legend className="mb-1 text-sm font-medium">Style</legend>
        <div className="flex flex-wrap gap-2">
          {(["", ...CATEGORIES.map((c) => c.id)] as (Category | "")[]).map((c) => (
            <button
              key={c || "all"}
              type="button"
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                category === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-muted",
              )}
            >
              {c || "All"}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="grid gap-2">
        <legend className="mb-1 text-sm font-medium">Duration</legend>
        <div role="radiogroup" aria-label="Duration" className="grid grid-cols-2 gap-2">
          {DURATION_FILTERS.map((d) => (
            <button
              key={d.id}
              type="button"
              role="radio"
              aria-checked={duration === d.id}
              onClick={() => setDuration(d.id)}
              className={cn(
                "rounded-lg border px-3 py-2 text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                duration === d.id ? "border-primary bg-primary/10 font-medium text-primary" : "border-border bg-background hover:bg-muted",
              )}
            >
              {d.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4">
        <div className="flex items-baseline justify-between text-sm font-medium">
          <span id="price-label">Price per person</span>
          <span className="tabular-nums text-muted-foreground">
            {money(price[0])} – {money(price[1])}
            {price[1] === PRICE_MAX ? "+" : ""}
          </span>
        </div>
        <Slider
          aria-labelledby="price-label"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={50}
          value={price}
          onValueChange={(v) => Array.isArray(v) && setPrice([v[0], v[1]])}
        />
        <div className="flex justify-between text-xs text-muted-foreground tabular-nums">
          <span>{money(PRICE_MIN)}</span>
          <span>{money(PRICE_MAX)}+</span>
        </div>
      </div>

      {activeCount > 0 && (
        <button type="button" onClick={reset} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
          <RotateCcw className="size-4" /> Clear {activeCount} {activeCount === 1 ? "filter" : "filters"}
        </button>
      )}
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[18rem_1fr] lg:gap-10">
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setFiltersOpen((o) => !o)}
        aria-expanded={filtersOpen}
        className="flex h-11 items-center justify-between rounded-xl border border-border bg-card px-4 text-sm font-medium lg:hidden"
      >
        <span className="inline-flex items-center gap-2">
          <SlidersHorizontal className="size-4" /> Filters{activeCount > 0 ? ` (${activeCount})` : ""}
        </span>
        <span className="text-muted-foreground">{filtersOpen ? "Hide" : "Show"}</span>
      </button>

      <aside className={cn("rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-24 lg:block lg:self-start", filtersOpen ? "block" : "hidden")}>
        <h2 className="mb-5 hidden text-base font-semibold lg:block">
          Filter trips
        </h2>
        {filters}
      </aside>

      <div>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            <span className="font-semibold text-foreground">{filtered.length}</span> {filtered.length === 1 ? "trip" : "trips"} found
            {travellers ? ` · priced for ${travellers} ${travellers === "1" ? "traveller" : "travellers"} on the next page` : ""}
          </p>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Sort</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={cn(controlClass, "w-auto")}>
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <p className="text-lg font-semibold">No trips match those filters</p>
            <p className="mt-1 text-sm text-muted-foreground">Try a wider price range or a different duration.</p>
            <button type="button" onClick={reset} className="mt-5 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground">
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => (
              <PackageCard key={p.slug} pkg={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
